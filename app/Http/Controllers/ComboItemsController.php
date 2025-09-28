<?php

namespace App\Http\Controllers;

use App\Models\StoreProductVariant;
use App\Models\ComboItem;
use Illuminate\Http\Request;

class ComboItemsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'sp_variant_id' => 'required|exists:store_product_variants,id',
            'item_variant_id' => 'required|exists:store_product_variants,id',
            'quantity' => 'required|numeric|min:1',
        ]);

        $data = $request->only(['sp_variant_id', 'item_variant_id', 'quantity']);
        $storeProductVariant = StoreProductVariant::find($data['sp_variant_id']);
        $this->authorize('update', $storeProductVariant);

        try {
            // Verificar se o item já está associado à variante
            $existingComboItem = ComboItem::where('sp_variant_id', $data['sp_variant_id'])
                ->where('item_variant_id', $data['item_variant_id'])
                ->first();

            if ($existingComboItem) {
                return redirect()->back()
                    ->with('fail', 'Este item já está associado a esta variante, se deseja alterar a quantidade, remova o item e adicione novamente com os valores desejados.');
            }

            $comboItem = ComboItem::create($data);

            if (!$comboItem) {
                return redirect()->back()->with('fail', 'Erro ao adicionar item à variante.');
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
        $comboItem = ComboItem::with('storeProductVariant')->findOrFail($id);
        $this->authorize('update', $comboItem->storeProductVariant);

        try {
            if (!$comboItem->delete()) {
                return redirect()->back()->with('fail', 'Erro ao remover item.');
            }

            return redirect()->back()->with('success', 'Item removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()->with('fail', 'Erro ao remover item: ' . $e->getMessage());
        }
    }
}
