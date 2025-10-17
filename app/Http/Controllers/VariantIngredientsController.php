<?php

namespace App\Http\Controllers;

use App\Models\StoreProductVariant;
use App\Models\VariantIngredient;
use Illuminate\Http\Request;

class VariantIngredientsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'sp_variant_id' => 'required|exists:store_product_variants,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'unit_id' => 'required|exists:units,id',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        $data = $request->only(['sp_variant_id', 'ingredient_id', 'unit_id', 'quantity']);
        $storeProductVariant = StoreProductVariant::find($data['sp_variant_id']);
        $this->authorize('update', $storeProductVariant);

        try {
            // Verificar se o ingrediente já está associado à variante
            $existingIngredient = VariantIngredient::where('sp_variant_id', $data['sp_variant_id'])
                ->where('ingredient_id', $data['ingredient_id'])
                ->first();

            if (($existingIngredient instanceof VariantIngredient) && $existingIngredient->deleted_at === null) {
                return redirect()->back()
                    ->with('fail', 'Este ingrediente já está associado a esta variante, se deseja alterar a quantidade, remova o ingrediente e adicione novamente com a quantidade desejada.');
            }

            $variantIngredient = VariantIngredient::withTrashed()->updateOrCreate([
                'sp_variant_id' => $data['sp_variant_id'],
                'ingredient_id' => $data['ingredient_id'],
            ], [
                'unit_id' => $data['unit_id'],
                'quantity' => $data['quantity'],
            ]);

            if (!$variantIngredient) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar ingrediente à variante.');
            }

            if ($variantIngredient->trashed()) {
                $variantIngredient->restore();
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
        $variantIngredient = VariantIngredient::with('storeProductVariant')->findOrFail($id);
        $this->authorize('update', $variantIngredient->storeProductVariant);

        try {
            if (!$variantIngredient->delete()) {
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

