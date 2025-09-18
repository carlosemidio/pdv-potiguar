<?php

namespace App\Http\Controllers;

use App\Http\Resources\AddonResource;
use App\Models\Addon;
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

        $search = $request->search ?? '';
        $addonsQuery = $this->addon->query();

        if (!request()->user()->hasPermission('addons_view', true)) {
            $addonsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $addonsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $addonsQuery->where('name', 'like', "%$search%");
        }

        $addons = $addonsQuery->orderBy('name')
            ->paginate(12, ['id', 'name', 'price', 'description']);

        return Inertia::render('Addons/Index', [
            'addons' => AddonResource::collection($addons),
            'search' => $search,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Addon::class);

        return Inertia::render('Addons/Form');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Addon::class);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric',
                'description' => 'nullable|string|max:1000',
            ]);

            $data['user_id'] = Auth::user()->id;

            $addon = $this->addon->create($data);

            if (!$addon) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar addon.');
            }

            return redirect()->route('addons.index')
                ->with('success', 'Addon criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar addon: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $addon = $this->addon->findOrFail($id);

        $this->authorize('update', $addon);

        return Inertia::render('Addons/Form', [
            'addon' => new AddonResource($addon),
        ]);
    }

    public function update(Request $request, $id)
    {
        $addon = $this->addon->findOrFail($id);

        $this->authorize('update', $addon);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric',
                'description' => 'nullable|string|max:1000',
            ]);

            if (!$addon->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar addon.');
            }

            return redirect()->route('addons.index')
                ->with('success', 'Addon atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar addon: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $addon = $this->addon->findOrFail($id);

        $this->authorize('delete', $addon);

        try {
            if (!$addon->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover addon.');
            }

            return redirect()->route('addons.index')
                ->with('success', 'Addon removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover addon: ' . $e->getMessage());
        }
    }
}
