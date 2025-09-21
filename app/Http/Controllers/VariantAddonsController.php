<?php

namespace App\Http\Controllers;

use App\Models\StoreProductVariant;
use App\Models\VariantAddon;
use Illuminate\Http\Request;

class VariantAddonsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'sp_variant_id' => 'required|exists:store_product_variants,id',
            'addon_id' => 'required|exists:addons,id',
            'quantity' => 'required|numeric|min:0.01',
            'price' => 'required|numeric|min:0',
        ]);

        $data = $request->only(['sp_variant_id', 'addon_id', 'quantity', 'price']);
        $storeProductVariant = StoreProductVariant::find($data['sp_variant_id']);
        $this->authorize('update', $storeProductVariant);

        try {
            // Verificar se o addon já está associado à variante
            $existingAddon = VariantAddon::where('sp_variant_id', $data['sp_variant_id'])
                ->where('addon_id', $data['addon_id'])
                ->first();

            if ($existingAddon) {
                return redirect()->back()
                    ->with('fail', 'Este complemento já está associado a esta variante, se deseja alterar a quantidade ou preço, remova o complemento e adicione novamente com os valores desejados.');
            }

            $variantAddon = VariantAddon::create($data);

            if (!$variantAddon) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar complemento à variante.');
            }

            return redirect()->back()
                ->with('success', 'Complemento criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao criar complemento: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $variantAddon = VariantAddon::with('storeProductVariant')->findOrFail($id);
        $this->authorize('update', $variantAddon->storeProductVariant);

        try {
            if (!$variantAddon->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover complemento.');
            }

            return redirect()->back()
                ->with('success', 'Complemento removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover complemento: ' . $e->getMessage());
        }
    }
}
