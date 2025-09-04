<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCreateFormRequest;
use App\Http\Requests\ProductUpdateFormRequest;
use App\Http\Resources\ProductResource;
use App\Models\AttributeValue;
use App\Models\File;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\VariantAttribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('products_view');
        $user = User::with('store')->find(Auth::id());

        if (!$user->store) {
            return redirect()->route('store.create')
                ->with('fail', 'Você precisa criar uma loja antes de cadastrar produtos.');
        }

        $productsQuery = Product::with(['user', 'store', 'image', 'variants.image', 'variants.attributeValues'])
            ->where('store_id', $user->store->id);

        if (!$user->hasPermission('products_view', true)) {
            $productsQuery->where('user_id', $user->id);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $productsQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            });
        }

        $products = $productsQuery->orderBy('name')
            ->paginate(10)->withQueryString();

        return Inertia::render('Product/Index', [
            'products' => ProductResource::collection($products)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Product::class);
     
        return Inertia::render('Product/Edit');
    }

    /**
     * Product a newly created resource in storage.
     */
    public function store(ProductCreateFormRequest $request)
    {
        $this->authorize('create', Product::class);
        $user = User::with('store')->find(Auth::id());
        $dataForm = $request->all();
        $dataForm['user_id'] = $user->id;
        $dataForm['store_id'] = $user->store->id;

        try {
            $product = Product::create($dataForm);
            if ($product instanceof Product) {
                // Add product variants
                if (isset($dataForm['variants'])) {
                    foreach ($dataForm['variants'] as $variantData) {
                        $productVariant = ProductVariant::create([
                            'product_id' => $product->id,
                            'attribute' => $variantData['attribute'],
                            'value' => $variantData['value'],
                            'sku' => $variantData['sku'] ?? null,
                            'price' => $variantData['price'],
                            'stock_quantity' => $variantData['stock_quantity'],
                        ]);

                        // Handle variant images
                        if (isset($variantData['files']) && is_array($variantData['files'])) {
                            foreach ($variantData['files'] as $file) {
                                $filePath = Storage::disk('public')
                                    ->put('/products/' . $product->slug, $file);
                                $uploadedFile = new File([  
                                    'user_id' => $request->user()->id,
                                    'name' => $file->getClientOriginalName(),
                                    'size' => $file->getSize(),
                                    'url' => $filePath,
                                    'extension' => $file->extension(),
                                ]);
                                $productVariant->images()->save($uploadedFile);
                            }
                        }
                    }
                }

                if (isset($dataForm['files']) && is_array($dataForm['files'])) {
                    foreach ($dataForm['files'] as $file) {
                        $filePath = Storage::disk('public')
                            ->put('/products/' . $product->slug, $file);
    
                        $uploadedFile = new File([
                            'user_id' => $request->user()->id,
                            'name' => $file->getClientOriginalName(),
                            'size' => $file->getSize(),
                            'url' => $filePath,
                            'extension' => $file->extension(),
                        ]);
                        
                        $product->images()->save($uploadedFile);
                    }
                }

                return redirect()->route('product.index')
                    ->with('success', 'Produto cadastrado com sucesso.');
            }

            return redirect()->back()
                ->with('fail', 'Erro ao cadastrar produto.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao cadastrar produto: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::where('id', $id)->firstOrFail();
        $this->authorize('view', $product);

        $product->load([
            'user',
            'category',
            'brand',
            'store',
            'image',
            'images',
            'variants.images'
        ]);

        return Inertia::render('Product/Show', [
            'product' => new ProductResource($product),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $product = Product::where('id', $id)->firstOrFail();
        $this->authorize('update', $product);

        $product->load([
            'user',
            'category',
            'brand',
            'store',
            'image',
            'images',
            'variants.image',
            'variants.images',
            'variants.attributes'
        ]);

        return Inertia::render('Product/Edit', [
            'product' => new ProductResource($product)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateFormRequest $request, $id)
    {
        $product = Product::where('id', $id)->firstOrFail();
        $this->authorize('update', $product);
        $dataForm = $request->all();

        // dd($dataForm);

        try {
            $product->update($dataForm);

            // Add/Update product variants
            if (isset($dataForm['variants'])) {
                foreach ($dataForm['variants'] as $variantData) {
                    $productVariant = ProductVariant::where('id', $variantData['id'] ?? null)
                        ->where('product_id', $product->id)
                        ->first();

                    if ($productVariant instanceof ProductVariant) {
                        // Update existing variant
                        $productVariant->update([
                            'sku' => $variantData['sku'] ?? null,
                            'price' => $variantData['price'],
                            'stock_quantity' => $variantData['stock_quantity'],
                        ]);
                    } else {
                        // Create new variant
                        $productVariant = ProductVariant::create([
                            'product_id' => $product->id,
                            'sku' => $variantData['sku'] ?? null,
                            'price' => $variantData['price'],
                            'stock_quantity' => $variantData['stock_quantity']
                        ]);
                    }

                    // Sync attributes if provided
                    if (isset($variantData['attributes']) && is_array($variantData['attributes']) && count($variantData['attributes']) > 0) {
                        $attributeNames = [];
                        foreach ($variantData['attributes'] as $attribute) {
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
                        
                        // Generate and update the slug based on attributes
                        $slug = $productVariant->generateSlugFromAttributes($product->name, $attributeNames);
                        $productVariant->slug = $slug;
                        $productVariant->save();
                    }

                    // Handle variant images
                    if (isset($variantData['files']) && is_array($variantData['files']) && count($variantData['files']) > 0) {
                        foreach ($variantData['files'] as $file) {
                            $filePath = Storage::disk('public')
                                ->put('/products/' . $product->slug, $file);

                            $uploadedFile = new File([
                                'user_id' => $request->user()->id,
                                'name' => $file->getClientOriginalName(),
                                'size' => $file->getSize(),
                                'url' => $filePath,
                                'extension' => $file->extension(),
                            ]);
                            
                            $productVariant->images()->save($uploadedFile);
                        }
                    }
                }
            }

            if (isset($dataForm['files']) && is_array($dataForm['files']) && count($dataForm['files']) > 0) {
                foreach ($dataForm['files'] as $file) {
                    $filePath = Storage::disk('public')
                        ->put('/products/' . $product->slug, $file);

                    $uploadedFile = new File([
                        'user_id' => $request->user()->id,
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'url' => $filePath,
                        'extension' => $file->extension(),
                    ]);
                    
                    $product->images()->save($uploadedFile);
                }
            }
        
            return redirect()->route('product.index')
                ->with('success', 'Produto atualizado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar produto: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::where('id', $id)->firstOrFail();
        $this->authorize('delete', $product);

        if ($product->delete()) {
            return redirect()->back()
                ->with('success', 'Produto excluído com sucesso.');
        } else {
            return redirect()->back()
                ->with('fail', 'Erro ao excluir produto.');
        }
    }
}
