<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('products_view');
        $user = User::find(Auth::id());

        $productsQuery = Product::with(['category', 'brand']);

        if (!request()->user()->hasPermission('products_view', true)) {
            $productsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $productsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $productsQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            });
        }

        $products = $productsQuery->orderBy('name')
            ->paginate(12)->withQueryString();

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
    public function store(Request $request)
    {
        $this->authorize('create', Product::class);
        $request->validate([
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

        $dataForm = $request->all();
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
    public function update(Request $request, $id)
    {
        $product = Product::where('id', $id)->firstOrFail();
        $this->authorize('update', $product);

        $request->validate([
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

        $dataForm = $request->all();

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

        if ($product->delete()) {
            return redirect()->back()
                ->with('success', 'Produto excluído com sucesso.');
        } else {
            return redirect()->back()
                ->with('fail', 'Erro ao excluir produto.');
        }
    }
}
