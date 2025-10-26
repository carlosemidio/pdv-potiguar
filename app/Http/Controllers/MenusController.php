<?php

namespace App\Http\Controllers;

use App\Http\Resources\AddonResource;
use App\Http\Resources\MenuResource;
use App\Http\Resources\StoreProductVariantResource;
use App\Models\Addon;
use App\Models\Menu;
use App\Models\Store;
use App\Models\StoreProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MenusController extends Controller
{
    protected $menu;

    public function __construct(Menu $menu)
    {
        $this->menu = $menu;
    }

    public function index(Request $request)
    {
        $this->authorize('menus_view');

        $search = $request->search ?? '';
        $menusQuery = $this->menu->query();

        if (!request()->user()->hasPermission('menus_view', true)) {
            $menusQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $menusQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $menusQuery->where('name', 'like', "%$search%");
        }

        $menus = $menusQuery->orderBy('name')
            ->paginate(12, ['id', 'user_id', 'name', 'is_permanent', 'created_at'])
            ->withQueryString();

        return Inertia::render('Menus/Index', [
            'menus' => MenuResource::collection($menus),
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Menu::class);
        
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_permanent' => 'required|boolean',
        ],[
            'name.required' => 'O campo nome é obrigatório.',
            'name.string' => 'O campo nome deve ser uma string.',
            'name.max' => 'O campo nome não pode exceder 255 caracteres.',
            'is_permanent.required' => 'O campo permanente é obrigatório.',
            'is_permanent.boolean' => 'O campo permanente deve ser verdadeiro ou falso.',
        ]);

        try {
            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = Auth::user()->tenant_id;
            $data['store_id'] = Auth::user()->store_id;

            $menu = $this->menu->create($data);

            if (!$menu) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar menu.');
            }

            return redirect()->route('menus.index')
                ->with('success', 'Menu criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar menu: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $menu = $this->menu->with([
            'storeProductVariants',
            'addons',
            'days',
            'schedules',
        ])->findOrFail($id);

        $this->authorize('view', $menu);

        $storeProductVariants = StoreProductVariant::where('store_id', $menu->store_id)
            ->where('is_produced', true)
            ->with(['productVariant'])
            ->join('product_variants', 'store_product_variants.product_variant_id', '=', 'product_variants.id')
            ->orderBy('product_variants.name')
            ->select('store_product_variants.*')
            ->get();

        $addons = Addon::where('store_id', $menu->store_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Menus/Show', [
            'menu' => new MenuResource($menu),
            'storeProductVariants' => StoreProductVariantResource::collection($storeProductVariants),
            'addons' => AddonResource::collection($addons),
        ]);
    }

    public function update(Request $request, $id)
    {
        $menu = $this->menu->findOrFail($id);

        $this->authorize('update', $menu);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'is_permanent' => 'required|boolean',
                'store_product_variant_ids' => 'array',
                'store_product_variant_ids.*' => 'exists:store_product_variants,id',
                'addon_ids' => 'array',
                'addon_ids.*' => 'exists:addons,id',
            ],[
                'name.required' => 'O campo nome é obrigatório.',
                'name.string' => 'O campo nome deve ser uma string.',
                'name.max' => 'O campo nome não pode exceder 255 caracteres.',
                'is_permanent.required' => 'O campo permanente é obrigatório.',
                'is_permanent.boolean' => 'O campo permanente deve ser verdadeiro ou falso.',
                'store_product_variant_ids.array' => 'O campo itens do menu deve ser um array.',
                'store_product_variant_ids.*.exists' => 'Um dos itens do menu selecionados é inválido.',
                'addon_ids.array' => 'O campo adicionais do menu deve ser um array.',
                'addon_ids.*.exists' => 'Um dos adicionais do menu selecionados é inválido.',
            ]);

            if (!$menu->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar menu.');
            }

            $menu->storeProductVariants()->sync($data['store_product_variant_ids']);
            $menu->addons()->sync($data['addon_ids']);

            return redirect()->route('menus.index')
                ->with('success', 'Menu atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar menu: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $menu = $this->menu->findOrFail($id);

        $this->authorize('delete', $menu);

        try {
            if (!$menu->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover marca.');
            }

            return redirect()->route('menus.index')
                ->with('success', 'Menu removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover menu: ' . $e->getMessage());
        }
    }
}
