<?php

namespace App\Services;

use App\Models\StockMovement;
use App\Enums\StockMovementSubtype;
use App\Models\Order;
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
        ) {
            $type = $this->resolveType($subtype);

            // atualiza estoque da loja
            $stockable = $this->updateStoreStock(
                $storeId,
                $stockableType,
                $stockableId,
                $quantity,
                $type,
                $costPrice
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
                'quantity' => $quantity,
                'cost_price' => $costPrice,
                'reason' => $reason,
                'document_number' => $documentNumber,
            ]);

            return $movement;
        });
    }

    public function registerSaleFromOrder(Order $order)
    {
        foreach ($order->items as $item) {
            if (count($item->storeProductVariant->ingredients) < 1) {
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
                    null
                );
            } else {
                // se o produto for composto, registra a saída dos ingredientes
                foreach ($item->storeProductVariant->ingredients as $ingredient) {
                    $this->register(
                        $order->user_id,
                        $order->tenant_id,
                        $order->store_id,
                        get_class($ingredient),
                        $ingredient->id,
                        ($ingredient->pivot->quantity * $item->quantity),
                        StockMovementSubtype::SALE,
                        $ingredient->cost_price,
                        "Ingrediente no produto: {$item->storeProductVariant->productVariant->name} (Pedido #{$order->number})",
                        null
                    );
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

    private function updateStoreStock(int $storeId, string $stockableType, int $stockableId, float $quantity, string $type, ?float $costPrice)
    {
        $stockable = app($stockableType)::where('id', $stockableId)
            ->where('store_id', $storeId)
            ->firstOrFail();

        if ($type === 'in') {
            // custo médio ponderado
            if ($costPrice !== null) {
                $totalOld = $stockable->stock_quantity * $stockable->cost_price;
                $totalNew = $quantity * $costPrice;
                $newQty   = $stockable->stock_quantity + $quantity;

                $stockable->cost_price = $newQty > 0 ? ($totalOld + $totalNew) / $newQty : $costPrice;
            }

            $stockable->stock_quantity += $quantity;
        } else {
            $stockable->stock_quantity -= $quantity;
        }

        $stockable->save();

        return $stockable;
    }
}
