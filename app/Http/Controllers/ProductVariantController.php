<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductVariantResource;
use App\Models\AttributeValue;
use App\Models\File;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\VariantAttribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('product-variants_view');

        $productVariantsQuery = ProductVariant::with([
            'product',
            'attributes.attributeValues',
            'image'
        ]);

        if (!request()->user()->hasPermission('product-variants_view', true)) {
            $productVariantsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $productVariantsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $productVariantsQuery->whereHas('product', function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            });
        }

        $productVariants = $productVariantsQuery->orderBy('id', 'desc')
            ->paginate(12)->withQueryString();

        return Inertia::render('ProductVariant/Index', [
            'productVariants' => ProductVariantResource::collection($productVariants)
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
    public function store(Request $request)
    {
        $this->authorize('create', ProductVariant::class);
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'sku' => 'nullable|string|max:100|unique:product_variants,sku,NULL,id,tenant_id,' . Auth::user()->tenant_id,
        ], [
            'product_id.required' => 'O produto é obrigatório.',
            'product_id.exists' => 'O produto selecionado não é válido.',
            'sku.unique' => 'Já existe uma variante com este SKU na loja.',
        ]);

        $dataForm = $request->all();
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
                                'user_id' => $request->user()->id,
                                'name' => $file->getClientOriginalName(),
                                'url' => $uploadedFilePath,
                                'size' => $file->getSize(),
                                'extension' => $file->getClientOriginalExtension(),
                                'public' => true,
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
    public function update(Request $request, $id)
    {
        $productVariant = ProductVariant::where('id', $id)->firstOrFail();
        $this->authorize('update', $productVariant);

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'sku' => 'nullable|string|max:100|unique:product_variants,sku,' . $productVariant->id . ',id,tenant_id,' . Auth::user()->tenant_id,
        ], [
            'product_id.required' => 'O produto é obrigatório.',
            'product_id.exists' => 'O produto selecionado não é válido.',
            'sku.unique' => 'Já existe uma variante com este SKU na loja.',
        ]);

        $dataForm = $request->all();

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
                                'user_id' => $request->user()->id,
                                'name' => $file->getClientOriginalName(),
                                'url' => $uploadedFilePath,
                                'size' => $file->getSize(),
                                'extension' => $file->getClientOriginalExtension(),
                                'public' => true,
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
            if ($productVariant->delete()) {
                return redirect()->route('product-variant.index')
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
}
