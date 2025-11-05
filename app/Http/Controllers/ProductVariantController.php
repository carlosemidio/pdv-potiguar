<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductVariantResource;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\File;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StoreProductVariant;
use App\Models\User;
use App\Models\VariantAttribute;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('product-variants_view');

        $request_data = Request::all('category', 'type', 'search', 'field', 'page', 'trashed');
        $user = User::find(Auth::id());

        $categories = Category::where('tenant_id', $user->tenant_id)
            ->whereHas('products.variants.storeProductVariants', function ($q) use ($user) {
                $q->where('store_id', $user->store_id);
            })
            ->orderBy('name', 'asc')
            ->get();

        $productVariantsQuery = ProductVariant::with([
            'product',
            'attributes.attributeValues',
            'image'
        ]);

        if (!$user->hasPermission('product-variants_view', true)) {
            $productVariantsQuery->where('user_id', Auth::id());
        }

        if ($user->tenant_id != null) {
            $productVariantsQuery->where('tenant_id', $user->tenant_id);
        }

        if (($request_data['category'] != null) && ($request_data['category'] != '')) {
            $productVariantsQuery->whereHas('product', function ($q) use ($request_data) {
                $q->where('category_id', $request_data['category']);
            });
        }

        if (($request_data['search'] != null) && ($request_data['search'] != '') && ($request_data['field'] != null)) {
            $productVariantsQuery->where($request_data['field'], 'like', '%' . $request_data['search'] . '%');
        }

        if ($request_data['trashed'] ?? false) {
            $productVariantsQuery->withTrashed();
        }

        $productVariants = $productVariantsQuery->orderBy('id', 'desc')
            ->paginate(12)->withQueryString();

        return Inertia::render('ProductVariant/Index', [
            'productVariants' => ProductVariantResource::collection($productVariants),
            'filters' => $request_data,
            'categories' => CategoryResource::collection($categories),
            'trashed' => $request_data['trashed'] ?? false,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', ProductVariant::class);

        return Inertia::render('ProductVariant/Form');
    }

    /**
     * Product a newly created resource in storage.
     */
    public function store()
    {
        $this->authorize('create', ProductVariant::class);
        $dataForm = Request::validated([
            'product_id' => 'required|exists:products,id',
            'sku' => 'nullable|string|max:100|unique:product_variants,sku,NULL,id,tenant_id,' . Auth::user()->tenant_id,
        ], [
            'product_id.required' => 'O produto é obrigatório.',
            'product_id.exists' => 'O produto selecionado não é válido.',
            'sku.unique' => 'Já existe uma variante com este SKU na loja.',
        ]);

        $dataForm['user_id'] = Auth::id();
        $dataForm['tenant_id'] = Auth::user()->tenant_id;

        $product = Product::where('tenant_id', $dataForm['tenant_id'])
            ->where('id', $dataForm['product_id'])
            ->first();

        if (!($product instanceof Product)) {
            return redirect()->back()
                ->with('fail', 'Produto associado à variante não encontrado.');
        }

        $dataForm['name'] = $product->name;

        if (isset($dataForm['attributes']) && is_array($dataForm['attributes']) && count($dataForm['attributes']) > 0) {
            $attributeNames = [];

            foreach ($dataForm['attributes'] as $attribute) {
                $attributeNames[] = $attribute['value'];
            }

            $dataForm['name'] .= (count($attributeNames) > 0 ? ' - ' . implode(', ', $attributeNames) : '');
        }

        // Verifica se a variante já existe
        $existingVariant = ProductVariant::where('product_id', $dataForm['product_id'])
            ->where('slug', Str::slug($dataForm['name']))
            ->withTrashed()
            ->first();

        if (($existingVariant instanceof ProductVariant) && ($existingVariant->deleted_at === null)) {
            return redirect()->back()
                ->with('fail', 'Já existe uma variante de produto com essas características para o produto selecionado.');
        }

        // Se a variante existir mas estiver soft-deleted, restaura-a
        if (($existingVariant instanceof ProductVariant) && ($existingVariant->deleted_at !== null)) {
            $existingVariant->restore();
            return redirect()->route('product-variant.edit', $existingVariant->id)
                ->with('success', 'Variante de produto restaurada com sucesso. Você pode atualizar-la se necessário.');
        }

        try {
            $productVariant = ProductVariant::create($dataForm);

            if (($productVariant instanceof ProductVariant)) {
                // Sync attributes if provided
                if (isset($dataForm['attributes']) && is_array($dataForm['attributes']) && count($dataForm['attributes']) > 0) {
                    $attributeNames = [];
                    foreach ($dataForm['attributes'] as $attribute) {
                        // Ensure the attribute exists
                        $attributeNames[] = $attribute['value'];
                        $attributeAux = VariantAttribute::where('name', $attribute['name'])->first();

                        if (!($attributeAux instanceof VariantAttribute)) {
                            $attributeAux = VariantAttribute::create([
                                'name' => $attribute['name'],
                            ]);
                        }

                        AttributeValue::updateOrCreate([
                                'product_variant_id' => $productVariant->id,
                                'variant_attribute_id' => $attributeAux->id
                            ],
                            ['value' => $attribute['value']]
                        );
                    }
                }

                // Handle variant images
                if (isset($dataForm['files']) && is_array($dataForm['files']) && count($dataForm['files']) > 0) {
                    foreach ($dataForm['files'] as $file) {
                        $uploadedFilePath = upload_file($file, '/products/variants/' . $productVariant->slug, true);

                        if ($uploadedFilePath) {
                            $uploadedFile = new File([
                                'user_id' => Auth::id(),
                                'name' => $file->getClientOriginalName(),
                                'url' => $uploadedFilePath,
                                'size' => $file->getSize(),
                                'extension' => $file->getClientOriginalExtension(),
                                'public' => false,
                            ]);
                            
                            $productVariant->images()->save($uploadedFile);
                        }
                    }
                }

                return redirect()->route('product-variant.edit', $productVariant->id)
                    ->with('success', 'Variante de produto cadastrada com sucesso.');
            }

            return redirect()->back()
                ->with('fail', 'Erro ao cadastrar variante de produto.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao cadastrar variante de produto: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $productVariant = ProductVariant::where('id', $id)->firstOrFail();
        $this->authorize('update', $productVariant);

        $productVariant->load(['product', 'attributes.attributeValues', 'images', 'image']);

        return Inertia::render('ProductVariant/Form', [
            'productVariant' => new ProductVariantResource($productVariant)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id)
    {
        $productVariant = ProductVariant::where('id', $id)->firstOrFail();
        $this->authorize('update', $productVariant);

        Request::validate([
            'product_id' => 'required|exists:products,id',
            'sku' => 'nullable|string|max:100|unique:product_variants,sku,' . $productVariant->id . ',id,tenant_id,' . Auth::user()->tenant_id,
        ], [
            'product_id.required' => 'O produto é obrigatório.',
            'product_id.exists' => 'O produto selecionado não é válido.',
            'sku.unique' => 'Já existe uma variante com este SKU na loja.',
        ]);

        $dataForm = Request::all();

        try {
            $dataForm['name'] = $productVariant->product->name;

            if (isset($dataForm['attributes']) && is_array($dataForm['attributes']) && count($dataForm['attributes']) > 0) {
                $attributeNames = [];

                foreach ($dataForm['attributes'] as $attribute) {
                    $attributeNames[] = $attribute['value'];
                }

                $dataForm['name'] .= (count($attributeNames) > 0 ? ' - ' . implode(', ', $attributeNames) : '');
            }

            // Verifica se a variante já existe
            $existingVariant = ProductVariant::where('product_id', $dataForm['product_id'])
                ->where('slug', Str::slug($dataForm['name']))
                ->first();

            if (($existingVariant instanceof ProductVariant) && ($existingVariant->id != $productVariant->id)) {
                return redirect(route('product-variant.edit', $productVariant->id))
                    ->with('fail', 'Já existe uma variante de produto com essas características para o produto selecionado.');
            }

            if ($productVariant->update($dataForm)) {
                if (isset($dataForm['attributes']) && is_array($dataForm['attributes']) && count($dataForm['attributes']) > 0) {
                    $attributeNames = [];
                    foreach ($dataForm['attributes'] as $attribute) {
                        // Ensure the attribute exists
                        $attributeNames[] = $attribute['value'];
                        $attributeAux = VariantAttribute::where('name', $attribute['name'])->first();

                        if (!($attributeAux instanceof VariantAttribute)) {
                            $attributeAux = VariantAttribute::create([
                                'name' => $attribute['name'],
                            ]);
                        }

                        AttributeValue::updateOrCreate([
                                'product_variant_id' => $productVariant->id,
                                'variant_attribute_id' => $attributeAux->id
                            ],
                            ['value' => $attribute['value']]
                        );
                    }

                    $product = $productVariant->product;

                    if (!($product)) {
                        throw new \Exception('Produto associado à variante não encontrado.');
                    }
                }

                // Handle variant images
                if (isset($dataForm['files']) && is_array($dataForm['files']) && count($dataForm['files']) > 0) {
                    foreach ($dataForm['files'] as $file) {
                        $uploadedFilePath = upload_file($file, '/products/variants/' . $productVariant->slug, true);

                        if ($uploadedFilePath) {
                            $uploadedFile = new File([
                                'user_id' => Request::id(),
                                'name' => $file->getClientOriginalName(),
                                'url' => $uploadedFilePath,
                                'size' => $file->getSize(),
                                'extension' => $file->getClientOriginalExtension(),
                                'public' => false,
                            ]);
                            
                            $productVariant->images()->save($uploadedFile);
                        }
                    }
                }

                return redirect()->back()
                    ->with('success', 'Variante de produto atualizada com sucesso.');
            } else {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar variante de produto.');
            }
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar variante de produto: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $productVariant = ProductVariant::where('id', $id)->firstOrFail();
        $this->authorize('delete', $productVariant);

        try {
            $deleted = DB::transaction(function () use ($productVariant) {
                // Deletar as associações na loja
                StoreProductVariant::whereHas('productVariant', function ($q) use ($productVariant) {
                    $q->where('id', $productVariant->id);
                })->delete();

                // Deletar a variante do produto
                return $productVariant->delete();
            });

            if ($deleted) {
                return redirect()->back()
                    ->with('success', 'Variante de produto excluída com sucesso.');
            } else {
                return redirect()->back()
                    ->with('fail', 'Erro ao excluir variante de produto.');
            }
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao excluir variante de produto: ' . $e->getMessage());
        }
    }

    public function restore(ProductVariant $productVariant)
    {
        $this->authorize('delete', $productVariant);

        try {
            $restored = DB::transaction(function () use ($productVariant) {
                // Restaurar o produto
                $productVariant->restore();

                // Restaurar as associações na loja
                StoreProductVariant::onlyTrashed()->whereHas('productVariant', function ($q) use ($productVariant) {
                    $q->where('id', $productVariant->id);
                })->restore();

                // Restaurar as variantes do produto
                return $productVariant;
            });

            if ($restored) {
                return redirect()->back()
                    ->with('success', 'Variante de produto restaurada com sucesso.');
            } else {
                return redirect()->back()
                    ->with('fail', 'Erro ao restaurar variante de produto.');
            }
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao restaurar variante de produto: ' . $e->getMessage());
        }
    }
}
