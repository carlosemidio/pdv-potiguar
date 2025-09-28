<?php

namespace App\Http\Controllers;

use App\Models\StoreProductVariant;
use App\Models\ComboItem;
use App\Models\ComboOptionItem;
use Illuminate\Http\Request;

class ComboOptionItemsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'option_group_id' => 'required|exists:combo_option_groups,id',
            'sp_variant_id' => 'required|exists:store_product_variants,id',
            'additional_price' => 'nullable|numeric|min:0',
            'quantity' => 'required|numeric|min:1',
        ]);

        $data = $request->only(['option_group_id', 'sp_variant_id', 'additional_price', 'quantity']);
        $storeProductVariant = StoreProductVariant::find($data['sp_variant_id']);
        $this->authorize('update', $storeProductVariant);

        try {
            // Verificar se o item já está associado à variante
            $existingComboOptionItem = ComboOptionItem::where('option_group_id', $data['option_group_id'])
                ->where('sp_variant_id', $data['sp_variant_id'])
                ->first();

            if ($existingComboOptionItem) {
                return redirect()->back()
                    ->with('fail', 'Este item já está associado a este grupo de opções, se deseja alterar a quantidade ou preço adicional, remova o item e adicione novamente com os valores desejados.');
            }

            $comboOptionItem = ComboOptionItem::create($data);

            if (!$comboOptionItem) {
                return redirect()->back()->with('fail', 'Erro ao adicionar item ao grupo de opções.');
            }

            return redirect()->back()
                ->with('success', 'Item criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao criar item: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $comboOptionItem = ComboOptionItem::with('storeProductVariant')->findOrFail($id);
        $this->authorize('update', $comboOptionItem->storeProductVariant);

        try {
            if (!$comboOptionItem->delete()) {
                return redirect()->back()->with('fail', 'Erro ao remover item.');
            }

            return redirect()->back()->with('success', 'Item removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()->with('fail', 'Erro ao remover item: ' . $e->getMessage());
        }
    }
}
