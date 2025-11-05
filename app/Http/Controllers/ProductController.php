<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StoreProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('products_view');
        $request_data = Request::all('category', 'type', 'search', 'field', 'page', 'trashed');
        $user = User::find(Auth::id());

        $categories = Category::where('tenant_id', $user->tenant_id)
            ->whereHas('products.variants.storeProductVariants', function ($q) use ($user) {
                $q->where('store_id', $user->store_id);
            })
            ->orderBy('name', 'asc')
            ->get();

        $productsQuery = Product::with(['category', 'brand']);

        if (!request()->user()->hasPermission('products_view', true)) {
            $productsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $productsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if (($request_data['category'] != null) && ($request_data['category'] != '')) {
            $productsQuery->where('category_id', $request_data['category']);
        }

        if (($request_data['search'] != null) && ($request_data['search'] != '') && ($request_data['field'] != null)) {
            $productsQuery->where($request_data['field'], 'like', '%' . $request_data['search'] . '%');
        }

        if ($request_data['trashed'] ?? false) {
            $productsQuery->withTrashed();
        }

        $products = $productsQuery->orderBy('name')
            ->paginate(12)->withQueryString();

        return Inertia::render('Product/Index', [
            'products' => ProductResource::collection($products),
            'filters' => $request_data,
            'categories' => CategoryResource::collection($categories),
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
    public function store()
    {
        $this->authorize('create', Product::class);
        Request::validate([
            'name' => 'required|string|max:255|unique:products,name,NULL,id,tenant_id,' . Auth::user()->tenant_id,
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
        ], [
            'name.required' => 'O nome do produto é obrigatório.',
            'name.unique' => 'Já existe um produto com este nome.',
            'category_id.required' => 'A categoria é obrigatória.',
            'category_id.exists' => 'A categoria selecionada não é válida.',
            'brand_id.exists' => 'A marca selecionada não é válida.',
        ]);

        $dataForm = Request::all();
        $dataForm['user_id'] = Auth::id();
        $dataForm['tenant_id'] = Auth::user()->tenant_id;

        try {
            if (Product::create($dataForm)) {
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
            'category',
            'brand'
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
            'category',
            'brand'
        ]);

        return Inertia::render('Product/Edit', [
            'product' => new ProductResource($product)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id)
    {
        $product = Product::where('id', $id)->firstOrFail();
        $this->authorize('update', $product);

        Request::validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id . ',id,tenant_id,' . Auth::user()->tenant_id,
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'description' => 'nullable|string',
        ], [
            'name.required' => 'O nome do produto é obrigatório.',
            'name.unique' => 'Já existe um produto com este nome.',
            'category_id.required' => 'A categoria é obrigatória.',
            'category_id.exists' => 'A categoria selecionada não é válida.',
            'brand_id.exists' => 'A marca selecionada não é válida.',
        ]);

        $dataForm = Request::all();

        try {
            if ($product->update($dataForm)) {
                return redirect()->route('product.index')
                    ->with('success', 'Produto atualizado com sucesso.');
            }

            return redirect()->back()
                ->with('fail', 'Erro ao atualizar produto.');
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

        try {
            $deleted = DB::transaction(function () use ($product) {
                // Deletar as variantes do produto e suas associações na loja
                StoreProductVariant::whereHas('productVariant', function ($q) use ($product) {
                    $q->where('product_id', $product->id);
                })->delete();

                // Deletar as variantes do produto
                ProductVariant::where('product_id', $product->id)->delete();

                // Deletar o produto
                return $product->delete();
            });

            if ($deleted) {
                return redirect()->back()
                    ->with('success', 'Produto excluído com sucesso.');
            } else {
                return redirect()->back()
                    ->with('fail', 'Erro ao excluir produto.');
            }
        } catch (\Throwable $th) {
            return redirect()->back()
                ->with('fail', 'Erro ao excluir produto: ' . $th->getMessage());
        }
    }

    public function restore(Product $product)
    {
        $this->authorize('delete', $product);

        try {
            $restored = DB::transaction(function () use ($product) {
                // Restaurar o produto
                $product->restore();

                // Restaurar as variantes do produto
                ProductVariant::onlyTrashed()->where('product_id', $product->id)->restore();

                // Restaurar as variantes do produto e suas associações na loja
                StoreProductVariant::onlyTrashed()->whereHas('productVariant', function ($q) use ($product) {
                    $q->where('product_id', $product->id);
                })->restore();

                return true;
            });

            if ($restored) {
                return redirect()->back()
                    ->with('success', 'Produto restaurado com sucesso.');
            } else {
                return redirect()->back()
                    ->with('fail', 'Erro ao restaurar produto.');
            }
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao restaurar produto: ' . $e->getMessage());
        }
    }
}
