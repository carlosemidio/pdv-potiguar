<?php

namespace App\Services;

use App\Models\StockMovement;
use App\Models\StoreProductVariant;
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
        int $productVariantId,
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
            $productVariantId,
            $quantity,
            $subtype,
            $costPrice,
            $reason,
            $documentNumber,
        ) {
            $type = $this->resolveType($subtype);

            // atualiza estoque da loja
            $storeVariant = $this->updateStoreStock(
                $userId ?? Auth::id(),
                $tenantId,
                $storeId,
                $productVariantId,
                $quantity,
                $type,
                $costPrice
            );

            // cria o registro
            $movement = StockMovement::create([
                'user_id' => $userId ?? Auth::id(),
                'tenant_id' => $tenantId,
                'store_id' => $storeId,
                'store_product_variant_id' => $storeVariant ? $storeVariant->id : null,
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
            $this->register(
                $order->user_id,
                $order->tenant_id,
                $order->store_id,
                $item->storeProductVariant->product_variant_id,
                $item->quantity,
                StockMovementSubtype::SALE,
                $item->cost_price,
                "Pedido #{$order->id}",
                null
            );
        }
    }


    private function resolveType(StockMovementSubtype $subtype): string
    {
        return match ($subtype) {
            StockMovementSubtype::PURCHASE,
            StockMovementSubtype::RETURN_CUSTOMER,
            StockMovementSubtype::ADJUSTMENT_IN,
            StockMovementSubtype::TRANSFER_IN => 'in',

            StockMovementSubtype::SALE,
            StockMovementSubtype::WASTE,
            StockMovementSubtype::RETURN_SUPPLIER,
            StockMovementSubtype::ADJUSTMENT_OUT,
            StockMovementSubtype::TRANSFER_OUT => 'out',
        };
    }

    private function updateStoreStock(int $userId, int $tenantId, int $storeId, int $productVariantId, float $quantity, string $type, ?float $costPrice)
    {
        $storeVariant = StoreProductVariant::firstOrCreate(
            ['store_id' => $storeId, 'product_variant_id' => $productVariantId],
            ['user_id' => $userId, 'tenant_id' => $tenantId, 'stock_quantity' => 0, 'cost_price' => 0, 'price' => 0]
        );

        if ($type === 'in') {
            // custo médio ponderado
            if ($costPrice !== null) {
                $totalOld = $storeVariant->stock_quantity * $storeVariant->cost_price;
                $totalNew = $quantity * $costPrice;
                $newQty   = $storeVariant->stock_quantity + $quantity;

                $storeVariant->cost_price = $newQty > 0 ? ($totalOld + $totalNew) / $newQty : $costPrice;
            }

            $storeVariant->stock_quantity += $quantity;
        } else {
            $storeVariant->stock_quantity -= $quantity;
        }

        $storeVariant->save();

        return $storeVariant;
    }
}
