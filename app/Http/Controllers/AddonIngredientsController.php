<?php

namespace App\Http\Controllers;

use App\Models\Addon;
use App\Models\AddonIngredient;
use Illuminate\Http\Request;

class AddonIngredientsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'addon_id' => 'required|exists:addons,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'unit_id' => 'required|exists:units,id',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        $data = $request->only(['addon_id', 'ingredient_id', 'unit_id', 'quantity']);
        $addon = Addon::find($data['addon_id']);
        $this->authorize('update', $addon);

        try {
            // Verificar se o ingrediente já está associado ao complemento
            $existingIngredient = AddonIngredient::where('addon_id', $data['addon_id'])
                ->where('ingredient_id', $data['ingredient_id'])
                ->first();

            if (($existingIngredient instanceof AddonIngredient) && $existingIngredient->deleted_at === null) {
                return redirect()->back()
                    ->with('fail', 'Este ingrediente já está associado a este complemento, se deseja alterar a quantidade, remova o ingrediente e adicione novamente com a quantidade desejada.');
            }

            $addonIngredient = AddonIngredient::withTrashed()->updateOrCreate([
                'addon_id' => $data['addon_id'],
                'ingredient_id' => $data['ingredient_id'],
            ], [
                'unit_id' => $data['unit_id'],
                'quantity' => $data['quantity'],
            ]);

            if (!$addonIngredient) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar ingrediente ao complemento.');
            }

            if ($addonIngredient->trashed()) {
                $addonIngredient->restore();
            }

            return redirect()->back()
                ->with('success', 'Ingrediente criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar ingrediente: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $addonIngredient = AddonIngredient::with('storeProductVariant')->findOrFail($id);
        $this->authorize('update', $addonIngredient->storeProductVariant);

        try {
            if (!$addonIngredient->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover ingrediente.');
            }

            return redirect()->back()
                ->with('success', 'Ingrediente removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover ingrediente: ' . $e->getMessage());
        }
    }
}
