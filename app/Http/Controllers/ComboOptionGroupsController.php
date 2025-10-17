<?php

namespace App\Http\Controllers;

use App\Models\StoreProductVariant;
use App\Models\ComboOptionGroup;
use Illuminate\Http\Request;

class ComboOptionGroupsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'sp_variant_id' => 'required|exists:store_product_variants,id',
            'name' => 'required|string|max:255',
            'min_options' => 'required|integer|min:0',
            'max_options' => 'required|integer|min:0',
            'is_required' => 'required|boolean',
        ]);

        $data = $request->only(['sp_variant_id', 'name', 'min_options', 'max_options', 'is_required']);
        $storeProductVariant = StoreProductVariant::find($data['sp_variant_id']);
        $this->authorize('update', $storeProductVariant);

        try {
            // Verificar se o grupo de opções já está associado à variante
            $existingComboOptionGroup = ComboOptionGroup::where('sp_variant_id', $data['sp_variant_id'])
                ->where('name', $data['name'])
                ->withTrashed()
                ->first();

            if (($existingComboOptionGroup instanceof ComboOptionGroup) && $existingComboOptionGroup->deleted_at === null) {
                return redirect()->back()
                    ->with('fail', 'Este grupo de opções já está associado a esta variante, se deseja alterar os valores, remova o grupo e adicione novamente com os valores desejados.');
            }

            $comboOptionGroup = ComboOptionGroup::withTrashed()->updateOrCreate([
                'sp_variant_id' => $data['sp_variant_id'],
                'name' => $data['name'],
            ], [
                'min_options' => $data['min_options'],
                'max_options' => $data['max_options'],
                'is_required' => $data['is_required'],
            ]);

            if (!$comboOptionGroup) {
                return redirect()->back()->with('fail', 'Erro ao adicionar grupo de opções à variante.');
            }

            if ($comboOptionGroup->trashed()) {
                $comboOptionGroup->restore();
            }

            return redirect()->back()
                ->with('success', 'Grupo de opções criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao criar grupo de opções: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $comboOptionGroup = ComboOptionGroup::with('storeProductVariant')->findOrFail($id);
        $this->authorize('update', $comboOptionGroup->storeProductVariant);

        try {
            if (!$comboOptionGroup->delete()) {
                return redirect()->back()->with('fail', 'Erro ao remover grupo de opções.');
            }

            return redirect()->back()->with('success', 'Grupo de opções removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()->with('fail', 'Erro ao remover grupo de opções: ' . $e->getMessage());
        }
    }
}
