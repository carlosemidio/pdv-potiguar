<?php

namespace App\Http\Controllers;

use App\Http\Resources\IngredientResource;
use App\Http\Resources\UnitResource;
use App\Models\Ingredient;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IngredientsController extends Controller
{
    protected $ingredient;

    public function __construct(Ingredient $ingredient)
    {
        $this->ingredient = $ingredient;
    }

    public function index(Request $request)
    {
        $this->authorize('ingredients_view');

        $search = $request->search ?? '';
        $ingredientsQuery = $this->ingredient->query()
            ->with('unit');

        if (!request()->user()->hasPermission('ingredients_view', true)) {
            $ingredientsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $ingredientsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $ingredientsQuery->where('name', 'like', "%$search%");
        }

        $ingredients = $ingredientsQuery->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        $units = \App\Models\Unit::orderBy('name')->get();

        return Inertia::render('Ingredients/Index', [
            'ingredients' => IngredientResource::collection($ingredients),
            'units' => UnitResource::collection($units),
            'search' => $search,
        ]);
    }
    public function store(Request $request)
    {
        $this->authorize('create', Ingredient::class);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'unit_id' => 'required|exists:units,id'
            ]);

            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = Auth::user()->tenant_id;
            $data['store_id'] = Auth::user()->store_id;

            $ingredient = $this->ingredient->create($data);

            if (!$ingredient) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar ingrediente.');
            }

            return redirect()->route('ingredients.index')
                ->with('success', 'Ingrediente criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar ingrediente: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $ingredient = $this->ingredient->findOrFail($id);

        $this->authorize('update', $ingredient);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'unit_id' => 'required|exists:units,id'
            ]);

            if (!$ingredient->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar ingrediente.');
            }

            return redirect()->route('ingredients.index')
                ->with('success', 'Ingrediente atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar ingrediente: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $ingredient = $this->ingredient->findOrFail($id);

        $this->authorize('delete', $ingredient);

        try {
            if (!$ingredient->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover ingrediente.');
            }

            return redirect()->route('ingredients.index')
                ->with('success', 'Ingrediente removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover ingrediente: ' . $e->getMessage());
        }
    }
}

