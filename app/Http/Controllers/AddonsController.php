<?php

namespace App\Http\Controllers;

use App\Http\Resources\AddonResource;
use App\Http\Resources\UnitResource;
use App\Models\Addon;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AddonsController extends Controller
{
    protected $addon;

    public function __construct(Addon $addon)
    {
        $this->addon = $addon;
    }

    public function index(Request $request)
    {
        $this->authorize('addons_view');
        $user = User::find(Auth::id());

        if ($user->store_id === null) {
            return redirect(route('dashboard'))
                ->with('fail', 'Usuário não está associado a nenhuma loja. Por favor, crie uma loja primeiro.');
        }

        $search = $request->search ?? '';
        $addonsQuery = $this->addon->query();

        if (!request()->user()->hasPermission('addons_view', true)) {
            $addonsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $addonsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($user->store_id != null) {
            $addonsQuery->where('store_id', $user->store_id);
        }

        if ($search != '') {
            $addonsQuery->where('name', 'like', "%$search%");
        }

        $addons = $addonsQuery->orderBy('name')
            ->with(['addonIngredients.ingredient', 'addonIngredients.unit'])
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Addons/Index', [
            'addons' => AddonResource::collection($addons),
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Addon::class);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = Auth::user()->tenant_id;
            $data['store_id'] = Auth::user()->store_id;

            $addon = $this->addon->create($data);

            if (!$addon) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar complemento.');
            }

            return redirect()->route('addons.show', $addon->id)
                ->with('success', 'Complemento criado com sucesso, agora você pode adicionar os ingredientes!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar complemento: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $addon = $this->addon->findOrFail($id);  
        $this->authorize('view', $addon);

        $addon->load([
            'addonIngredients.ingredient',
            'addonIngredients.unit'
        ]);

        $units = \App\Models\Unit::all();

        return Inertia::render('Addons/Show', [
            'addon' => new AddonResource($addon),
            'units' => UnitResource::collection($units),
        ]);
    }

    public function update(Request $request, $id)
    {
        $addon = $this->addon->findOrFail($id);

        $this->authorize('update', $addon);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            if (!$addon->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar complemento.');
            }

            return redirect()->route('addons.index')
                ->with('success', 'Complemento atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar complemento: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $addon = $this->addon->findOrFail($id);

        $this->authorize('delete', $addon);

        try {
            if (!$addon->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover complemento.');
            }

            return redirect()->route('addons.index')
                ->with('success', 'Complemento removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover complemento: ' . $e->getMessage());
        }
    }
}
