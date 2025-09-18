<?php

namespace App\Http\Controllers;

use App\Http\Resources\StoreProductVariantResource;
use App\Models\StoreProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StoreProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('store-product-variants_view');

        $user = User::with('store')->find(Auth::id());

        if (!$user->store) {
            return redirect(route('dashboard'))
                ->with('fail', 'Usuário não está associado a nenhuma loja. Por favor, crie uma loja primeiro.');
        }

        $query = StoreProductVariant::where('store_id', $user->store->id)
            ->with(['productVariant.image', 'productVariant.product', 'store']);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('productVariant.product', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        $data = $query->orderBy('id', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('StoreProductVariant/Index', [
            'storeProductVariants' => StoreProductVariantResource::collection($data),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', StoreProductVariant::class);

        return Inertia::render('StoreProductVariant/Form');
    }

    /**
     * Product a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', StoreProductVariant::class);

        $request->validate([
            'product_variant_id' => [
                'required',
                'exists:product_variants,id',
                'unique:store_product_variants,product_variant_id,NULL,id,store_id,' . (User::with('store')->find(Auth::id())->store->id ?? 'NULL'),
            ],
            'cost_price' => 'nullable|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'featured' => 'boolean',
        ], [
            'product_variant_id.required' => 'A variante do produto é obrigatória.',
            'product_variant_id.exists' => 'A variante do produto selecionada não é válida.',
            'product_variant_id.unique' => 'Esta variante do produto já está associada a esta loja.',
            'price.required' => 'O preço é obrigatório.',
            'price.numeric' => 'O preço deve ser um valor numérico.',
            'price.min' => 'O preço deve ser no mínimo 0.',
            'cost_price.numeric' => 'O preço de custo deve ser um valor numérico.',
            'cost_price.min' => 'O preço de custo deve ser no mínimo 0.',
            'stock_quantity.required' => 'A quantidade em estoque é obrigatória.',
            'stock_quantity.integer' => 'A quantidade em estoque deve ser um número inteiro.',
            'stock_quantity.min' => 'A quantidade em estoque deve ser no mínimo 0.',
        ]);

        $user = User::with('store')->find(Auth::id());

        if (!$user->store) {
            return redirect()->back()
                ->with('fail', 'Usuário não está associado a nenhuma loja.');
        }

        $dataForm = $request->all();
        $dataForm['user_id'] = $user->id;
        $dataForm['tenant_id'] = $user->tenant_id;
        $dataForm['store_id'] = $user->store->id;

        try {
            $storeProductVariant = StoreProductVariant::create($dataForm);

            if ($storeProductVariant instanceof StoreProductVariant) {
                return redirect()->back()
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
        $storeProductVariant = StoreProductVariant::where('id', $id)
            ->firstOrFail();

        $this->authorize('update', $storeProductVariant);

        $storeProductVariant->load(['productVariant.product', 'store']);

        return Inertia::render('StoreProductVariant/Form', [
            'storeProductVariant' => new StoreProductVariantResource($storeProductVariant),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'product_variant_id' => [
                'required',
                'exists:product_variants,id',
                'unique:store_product_variants,product_variant_id,' . $id . ',id,store_id,' . (User::with('store')->find(Auth::id())->store->id ?? 'NULL'),
            ],
            'cost_price' => 'nullable|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'featured' => 'boolean',
        ], [
            'product_variant_id.required' => 'A variante do produto é obrigatória.',
            'product_variant_id.exists' => 'A variante do produto selecionada não é válida.',
            'product_variant_id.unique' => 'Esta variante do produto já está associada a esta loja.',
            'price.required' => 'O preço é obrigatório.',
            'price.numeric' => 'O preço deve ser um valor numérico.',
            'price.min' => 'O preço deve ser no mínimo 0.',
            'cost_price.numeric' => 'O preço de custo deve ser um valor numérico.',
            'cost_price.min' => 'O preço de custo deve ser no mínimo 0.',
            'stock_quantity.required' => 'A quantidade em estoque é obrigatória.',
            'stock_quantity.integer' => 'A quantidade em estoque deve ser um número inteiro.',
            'stock_quantity.min' => 'A quantidade em estoque deve ser no mínimo 0.',
        ]);

        $storeProductVariant = StoreProductVariant::where('id', $id)
            ->firstOrFail();

        $this->authorize('update', $storeProductVariant);

        $dataForm = $request->all();

        try {
            if ($storeProductVariant->update($dataForm)) {
                return redirect()->back()
                    ->with('success', 'Variante de produto atualizada com sucesso.');
            }

            return redirect()->back()
                ->with('fail', 'Erro ao atualizar variante de produto.');
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
        $storeProductVariant = StoreProductVariant::where('id', $id)
            ->firstOrFail();

        $this->authorize('delete', $storeProductVariant);

        try {
            if ($storeProductVariant->delete()) {
                return redirect()->route('store-product-variant.index')
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

