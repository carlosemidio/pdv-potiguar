<?php

namespace App\Http\Controllers;

use App\Models\StoreProductVariant;
use App\Models\VariantAddonGroup;
use Illuminate\Http\Request;

class VariantAddonGroupsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'sp_variant_id' => 'required|exists:store_product_variants,id',
            'name' => 'required|string|max:255',
            'is_required' => 'required|boolean',
            'min_options' => 'required|integer|min:0',
            'max_options' => 'required|integer|min:1',
        ]);

        $data = $request->only(['sp_variant_id', 'name', 'is_required', 'min_options', 'max_options']);
        $storeProductVariant = StoreProductVariant::find($data['sp_variant_id']);
        $this->authorize('update', $storeProductVariant);

        try {
            // Verificar se já existe um grupo com o mesmo nome para a variante
            $existingGroup = VariantAddonGroup::where('sp_variant_id', $data['sp_variant_id'])
                ->where('name', $data['name'])
                ->first();

            if ($existingGroup) {
                return redirect()->back()
                    ->with('fail', 'Já existe um grupo de complementos com este nome para esta variante.');
            }

            $variantAddonGroup = VariantAddonGroup::create($data);

            if (!$variantAddonGroup) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar grupo de complementos à variante.');
            }

            return redirect()->back()
                ->with('success', 'Grupo de complementos criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao criar grupo de complementos: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $variantAddonGroup = VariantAddonGroup::with('storeProductVariant')->findOrFail($id);
        $this->authorize('update', $variantAddonGroup->storeProductVariant);

        try {
            if (!$variantAddonGroup->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover grupo de complementos.');
            }

            return redirect()->back()
                ->with('success', 'Grupo de complementos removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover grupo de complementos: ' . $e->getMessage());
        }
    }
}
