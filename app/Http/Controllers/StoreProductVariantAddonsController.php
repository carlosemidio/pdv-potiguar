<?php

namespace App\Http\Controllers;

use App\Models\StoreProductVariant;
use App\Models\StoreProductVariantAddon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StoreProductVariantAddonsController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('create', StoreProductVariant::class);

        try {
            $data = $request->validate([
                'store_product_variant_id' => 'required|exists:store_product_variants,id|unique:store_product_variant_addons,store_product_variant_id,NULL,id,deleted_at,NULL',
                'name' => 'required|string|max:255',
                'price' => 'required|numeric'
            ]);

            $storeProductVariant = StoreProductVariant::find($data['store_product_variant_id']);
            $this->authorize('update', $storeProductVariant);

            $data['user_id'] = Auth::user()->id;
            $addon = StoreProductVariantAddon::create($data);

            if (!$addon) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar complemento.');
            }

            return redirect()->route('addons.index')
                ->with('success', 'Complemento criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar complemento: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $addon = StoreProductVariantAddon::findOrFail($id);
        $storeProductVariant = StoreProductVariant::find($addon->store_product_variant_id);
        $this->authorize('update', $storeProductVariant);

        try {
            if (!$addon->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover complemento.');
            }

            return redirect()->route('addons.index')
                ->with('success', 'Complemento removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover complemento: ' . $e->getMessage());
        }
    }
}
