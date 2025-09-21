<?php

namespace App\Http\Controllers;

use App\Models\AddonGroupOption;
use App\Models\VariantAddonGroup;
use Illuminate\Http\Request;

class AddonGroupOptionsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'addon_group_id'    => 'required|exists:variant_addon_groups,id',
            'addon_id'          => 'required|exists:addons,id',
            'quantity'          => 'required|numeric|min:1',
            'additional_price'  => 'required|numeric|min:0',
        ]);

        $data = $request->only([
            'addon_group_id',
            'addon_id',
            'quantity',
            'additional_price',
        ]);

        $addonGroup = VariantAddonGroup::with('storeProductVariant')->findOrFail($data['addon_group_id']);
        $this->authorize('update', $addonGroup->storeProductVariant);

        try {
            // Verificar se o addon já está associado ao grupo
            $existingOption = AddonGroupOption::where('addon_group_id', $data['addon_group_id'])
                ->where('addon_id', $data['addon_id'])
                ->first();

            if ($existingOption) {
                return redirect()->back()
                    ->with('fail', 'Este complemento já está associado a este grupo, se deseja alterar a quantidade ou preço, remova e adicione novamente com os valores desejados.');
            }

            $addonGroupOption = AddonGroupOption::create($data);

            if (!$addonGroupOption) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar complemento ao grupo.');
            }

            return redirect()->back()
                ->with('success', 'Complemento adicionado ao grupo com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao adicionar complemento: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $addonOptionGroup = AddonGroupOption::with('addonGroup')->findOrFail($id);
        $this->authorize('update', $addonOptionGroup->addonGroup);

        try {
            if (!$addonOptionGroup->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover complemento do grupo.');
            }

            return redirect()->back()
                ->with('success', 'Complemento removido do grupo com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover complemento: ' . $e->getMessage());
        }
    }
}
