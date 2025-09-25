<?php

namespace App\Services;

use App\Models\StockMovement;
use App\Enums\StockMovementSubtype;
use App\Models\Order;
use App\Models\Unit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockMovementService
{
    public function register(
        ?int $userId = null,
        int $tenantId,
        int $storeId,
        string $stockableType,
        int $stockableId,
        float $quantity,
        StockMovementSubtype $subtype,
        ?float $costPrice = null,
        ?string $reason = null,
        ?string $documentNumber = null,
        ?Unit $unit
    ): StockMovement {
        return DB::transaction(function () use (
            $userId,
            $tenantId,
            $storeId,
            $stockableType,
            $stockableId,
            $quantity,
            $subtype,
            $costPrice,
            $reason,
            $documentNumber,
            $unit
        ) {
            $type = $this->resolveType($subtype);

            // atualiza estoque da loja
            $result = $this->updateStoreStock(
                $storeId,
                $stockableType,
                $stockableId,
                $quantity,
                $type,
                $costPrice,
                $unit
            );

            // cria o registro
            $movement = StockMovement::create([
                'user_id' => $userId ?? Auth::id(),
                'tenant_id' => $tenantId,
                'store_id' => $storeId,
                'stockable_type' => $stockableType,
                'stockable_id' => $stockableId,
                'type' => $type,
                'subtype' => $subtype->value,
                'quantity' => $result['quantity'],
                'cost_price' => $result['cost_price'] ?? $costPrice,
                'reason' => $reason,
                'document_number' => $documentNumber,
            ]);

            return $movement;
        });
    }

    public function registerSaleFromOrder(Order $order)
    {
        foreach ($order->items as $item) {
            $item->load(
                'orderItemOptions.addonGroupOption.addon.addonIngredients.ingredient',
                'orderItemOptions.addonGroupOption.addon.addonIngredients.unit',
                'storeProductVariant.variantIngredients.ingredient',
                'storeProductVariant.variantIngredients.unit',
                'orderItemAddons.variantAddon.addon.addonIngredients.ingredient',
                'orderItemAddons.variantAddon.addon.addonIngredients.unit'
            );
            
            if ($item->storeProductVariant->is_produced) {
                $this->register(
                    $order->user_id,
                    $order->tenant_id,
                    $order->store_id,
                    get_class($item->storeProductVariant),
                    $item->storeProductVariant->product_variant_id,
                    $item->quantity,
                    StockMovementSubtype::SALE,
                    $item->cost_price,
                    "Pedido #{$order->id}",
                    null,
                    null
                );
            } else {
                if (count($item->orderItemOptions) > 0) {
                    foreach ($item->orderItemOptions as $option) {
                        if ($option->addonGroupOption && $option->addonGroupOption->addon && ($option->addonGroupOption->addon->addonIngredients->count() > 0)) {
                            foreach ($option->addonGroupOption->addon->addonIngredients as $addonIngredient) {
                                $this->register(
                                    $order->user_id,
                                    $order->tenant_id,
                                    $order->store_id,
                                    get_class($addonIngredient->ingredient),
                                    $addonIngredient->ingredient->id,
                                    ($addonIngredient->quantity * $option->quantity),
                                    StockMovementSubtype::SALE,
                                    $addonIngredient->ingredient->cost_price,
                                    "Ingrediente na opção: {$option->addonGroupOption->addon->name} do produto: {$item->storeProductVariant->productVariant->name} (Pedido #{$order->number})",
                                    null,
                                    $addonIngredient->unit
                                );
                            }
                        }
                    }
                }

                if (count($item->orderItemAddons) > 0) {
                    foreach ($item->orderItemAddons as $variantAddon) {
                        if ($variantAddon->variantAddon && $variantAddon->variantAddon->addon && ($variantAddon->variantAddon->addon->addonIngredients->count() > 0)) {
                            foreach ($variantAddon->variantAddon->addon->addonIngredients as $addonIngredient) {
                                $this->register(
                                    $order->user_id,
                                    $order->tenant_id,
                                    $order->store_id,
                                    get_class($addonIngredient->ingredient),
                                    $addonIngredient->ingredient->id,
                                    ($addonIngredient->quantity * $variantAddon->quantity),
                                    StockMovementSubtype::SALE,
                                    $addonIngredient->ingredient->cost_price,
                                    "Ingrediente no adicional: {$variantAddon->variantAddon->addon->name} do produto: {$item->storeProductVariant->productVariant->name} (Pedido #{$order->number})",
                                    null,
                                    $addonIngredient->unit
                                );
                            }
                        }
                    }
                }

                if (count($item->storeProductVariant->variantIngredients) > 0) {
                    foreach ($item->storeProductVariant->variantIngredients as $variantIngredient) {
                        $this->register(
                            $order->user_id,
                            $order->tenant_id,
                            $order->store_id,
                            get_class($variantIngredient->ingredient),
                            $variantIngredient->ingredient->id,
                            ($variantIngredient->quantity * $item->quantity),
                            StockMovementSubtype::SALE,
                            $variantIngredient->ingredient->cost_price,
                            "Ingrediente no produto: {$item->storeProductVariant->productVariant->name} (Pedido #{$order->number})",
                            null,
                            $variantIngredient->unit
                        );
                    }
                }
            }
        }
    }


    private function resolveType(StockMovementSubtype $subtype): string
    {
        return match ($subtype) {
            StockMovementSubtype::PURCHASE,
            StockMovementSubtype::RETURN_CUSTOMER,
            StockMovementSubtype::ADJUSTMENT_IN,
            StockMovementSubtype::TRANSFER_IN => 1,

            StockMovementSubtype::SALE,
            StockMovementSubtype::WASTE,
            StockMovementSubtype::RETURN_SUPPLIER,
            StockMovementSubtype::ADJUSTMENT_OUT,
            StockMovementSubtype::TRANSFER_OUT => 0,
        };
    }

    private function updateStoreStock(int $storeId, string $stockableType, int $stockableId, float $quantity, string $type, ?float $costPrice, ?Unit $unit)
    {
        $stockable = app($stockableType)::where('id', $stockableId)
            ->where('store_id', $storeId)->firstOrFail();

        if (($unit instanceof Unit) && ($unit->id != $stockable->unit_id)) {
            $stockable->load('unit');
            $quantity = unit_convert($quantity, $unit->symbol, $stockable->unit->symbol);
        }

        if ($type == 1) {
            // custo médio ponderado
            if ($costPrice !== null) {
                $totalOld = $stockable->stock_quantity * $stockable->cost_price;
                $totalNew = $costPrice;
                $newQty = $stockable->stock_quantity + $quantity;
                $stockable->cost_price = $newQty > 0 ? ($totalOld + $totalNew) / $newQty : $costPrice;
            }

            $stockable->stock_quantity += $quantity;
        } else {
            $stockable->stock_quantity -= $quantity;
        }

        $stockable->save();

        return [
            'stockable' => $stockable,
            'quantity' => $quantity
        ];
    }
}
