<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\StoreProductVariantResource;
use App\Http\Resources\UnitResource;
use App\Models\Category;
use App\Models\StoreProductVariant;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StoreProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('store-product-variants_view');
        $user = User::find(Auth::id());
        $request_data = Request::all('category', 'type', 'search', 'field', 'page');

        $categories = Category::where('tenant_id', $user->tenant_id)
            ->whereHas('products.variants.storeProductVariants', function ($q) use ($user) {
                $q->where('store_id', $user->store_id);
            })
            ->orderBy('name', 'asc')
            ->get();

        if ($user->store_id === null) {
            return redirect(route('dashboard'))
                ->with('fail', 'Usuário não está associado a nenhuma loja. Por favor, crie uma loja primeiro.');
        }

        $query = StoreProductVariant::where('store_id', $user->store_id)
            ->with(['productVariant.image', 'productVariant.product', 'store']);

        if (!request()->user()->hasPermission('store-product-variants_view', true)) {
            $query->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $query->where('tenant_id', request()->user()->tenant_id);
        }

        if ($user->store_id != null) {
            $query->where('store_id', $user->store_id);
        }

        if (($request_data['category'] != null) && ($request_data['category'] != '')) {
            $query->whereHas('productVariant.product', function ($q) use ($request_data) {
                $q->where('category_id', $request_data['category']);
            });
        }

        if (($request_data['search'] != null) && ($request_data['search'] != '') && ($request_data['field'] != null)) {
            $query->whereHas('productVariant', function ($q) use ($request_data) {
                $q->where('name', 'like', '%' . $request_data['search'] . '%');
            });
        }

        $data = $query->orderBy('id', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('StoreProductVariant/Index', [
            'storeProductVariants' => StoreProductVariantResource::collection($data),
            'categories' => CategoryResource::collection($categories),
            'filters' => $request_data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', StoreProductVariant::class);

        $unitList = Unit::all();

        return Inertia::render('StoreProductVariant/Form', [
            'units' => UnitResource::collection($unitList),
        ]);
    }

    /**
     * Product a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', StoreProductVariant::class);

        $user = User::find(Auth::id());
        $request->validate([
            'product_variant_id' => [
                'required',
                'exists:product_variants,id',
                Rule::unique('store_product_variants')
                    ->where(function ($query) use ($user) {
                        $query->where('store_id', $user->store_id)
                              ->whereNull('deleted_at');
                    }),
            ],
            'price' => 'required|numeric|min:0',
            'featured' => 'boolean',
        ], [
            'product_variant_id.required' => 'A variante do produto é obrigatória.',
            'product_variant_id.exists' => 'A variante do produto selecionada não é válida.',
            'product_variant_id.unique' => 'Esta variante do produto já está associada a esta loja.',
            'price.required' => 'O preço é obrigatório.',
            'price.numeric' => 'O preço deve ser um valor numérico.',
            'price.min' => 'O preço deve ser no mínimo 0.',
            'featured.boolean' => 'O campo em destaque deve ser verdadeiro ou falso.',
        ]);

        $user = User::find(Auth::id());

        if ($user->store_id === null) {
            return redirect()->back()
                ->with('fail', 'Usuário não está associado a nenhuma loja.');
        }

        $dataForm = $request->all();
        $dataForm['user_id'] = $user->id;
        $dataForm['tenant_id'] = $user->tenant_id;
        $dataForm['store_id'] = $user->store_id;

        try {
            $storeProductVariant = DB::transaction(function () use ($dataForm) {
                $storeProductVariant = StoreProductVariant::where('product_variant_id', $dataForm['product_variant_id'])
                    ->where('store_id', $dataForm['store_id'])
                    ->withTrashed()
                    ->first();

                if ($storeProductVariant) {
                    // Se a variante já existe (mesmo que deletada), restaure-a e atualize os dados
                    $storeProductVariant->restore();
                    $storeProductVariant->update($dataForm);
                } else {
                    $storeProductVariant = StoreProductVariant::create($dataForm);
                }

                if ($dataForm['ingredients'] ?? false) {
                    // Adiciona os ingredientes
                    foreach ($dataForm['ingredients'] as $ingredient) {
                        $storeProductVariant->ingredients()->create([
                            'ingredient_id' => $ingredient['ingredient_id'],
                            'unit_id' => $ingredient['unit_id'],
                            'quantity' => $ingredient['quantity']
                        ]);
                    }
                }

                return $storeProductVariant;
            });

            if ($storeProductVariant instanceof StoreProductVariant) {
                if (!$storeProductVariant->is_produced) {
                    return redirect(route('store-product-variant.index'))
                        ->with('success', 'Variante de produto cadastrada com sucesso.');
                } else {
                    return redirect(route('store-product-variant.show', $storeProductVariant->id))
                        ->with('success', 'Variante de produto cadastrada com sucesso.');
                }
            }

            return redirect()->back()
                ->with('fail', 'Erro ao cadastrar variante de produto.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao cadastrar variante de produto: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $storeProductVariant = StoreProductVariant::where('id', $id)
            ->firstOrFail();

        $this->authorize('view', $storeProductVariant);

        $storeProductVariant->load([
            'store',
            'productVariant.product.category',
            'productVariant.product.brand',
            'productVariant.image',
            'variantIngredients.ingredient',
            'variantIngredients.unit',
            'variantAddons.addon',
            'variantAddonGroups',
            'variantAddonGroups.addonGroupOptions.addon',
            'comboItems.itemVariant.productVariant.product',
            'comboItems.itemVariant.productVariant.image',
            'comboOptionGroups.comboOptionItems.storeProductVariant.productVariant.product',
            'comboOptionGroups.comboOptionItems.storeProductVariant.productVariant.image',
        ]);

        $unitList = Unit::all();

        return Inertia::render('StoreProductVariant/Show', [
            'storeProductVariant' => new StoreProductVariantResource($storeProductVariant),
            'units' => UnitResource::collection($unitList),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $storeProductVariant = StoreProductVariant::where('id', $id)->firstOrFail();

        $this->authorize('update', $storeProductVariant);
        $storeProductVariant->load(['productVariant.product', 'store']);
        $unitList = Unit::all();

        return Inertia::render('StoreProductVariant/Form', [
            'storeProductVariant' => new StoreProductVariantResource($storeProductVariant),
            'units' => UnitResource::collection($unitList),
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
            'price' => 'required|numeric|min:0',
            'featured' => 'boolean',
        ], [
            'product_variant_id.required' => 'A variante do produto é obrigatória.',
            'product_variant_id.exists' => 'A variante do produto selecionada não é válida.',
            'product_variant_id.unique' => 'Esta variante do produto já está associada a esta loja.',
            'price.required' => 'O preço é obrigatório.',
            'price.numeric' => 'O preço deve ser um valor numérico.',
            'price.min' => 'O preço deve ser no mínimo 0.',
            'featured.boolean' => 'O campo em destaque deve ser verdadeiro ou falso.',
        ]);

        $storeProductVariant = StoreProductVariant::where('id', $id)->firstOrFail();
        $this->authorize('update', $storeProductVariant);
        $dataForm = $request->all();

        try {
            if ($storeProductVariant->update($dataForm)) {
                if (isset($dataForm['ingredients'])) {
                    // Sincroniza os ingredientes
                    $existingIngredientIds = $storeProductVariant->ingredients()->pluck('id')->toArray();
                    $submittedIngredientIds = array_filter(array_map(fn($ing) => $ing['id'] ?? null, $dataForm['ingredients']));

                    // Ingredientes a serem removidos
                    $ingredientsToRemove = array_diff($existingIngredientIds, $submittedIngredientIds);
                    if (!empty($ingredientsToRemove)) {
                        $storeProductVariant->ingredients()->whereIn('id', $ingredientsToRemove)->delete();
                    }

                    // Adiciona ou atualiza os ingredientes
                    foreach ($dataForm['ingredients'] as $ingredient) {
                        if (isset($ingredient['id']) && in_array($ingredient['id'], $existingIngredientIds)) {
                            // Atualiza o ingrediente existente
                            $storeProductVariant->ingredients()->where('id', $ingredient['id'])->update([
                                'ingredient_id' => $ingredient['ingredient_id'],
                                'unit_id' => $ingredient['unit_id'],
                                'quantity' => $ingredient['quantity']
                            ]);
                        } else {
                            // Adiciona um novo ingrediente
                            $storeProductVariant->ingredients()->create([
                                'ingredient_id' => $ingredient['ingredient_id'],
                                'unit_id' => $ingredient['unit_id'],
                                'quantity' => $ingredient['quantity']
                            ]);
                        }
                    }
                }

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
        $storeProductVariant = StoreProductVariant::where('id', $id)->firstOrFail();
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

