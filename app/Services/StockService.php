<?php

namespace App\Interfaces;

use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockService implements StockServiceInterface
{
    public static function move(int $storeId, ProductVariant $variant, float $quantity, string $type, array $extra = []): array
    {
        try {
            $stockMovement = DB::transaction(function () use ($storeId, $variant, $quantity, $type, $extra) {
                $previousQuantity = $variant->stock_quantity;
                $finalQuantity = match ($type) {
                    'in' => $previousQuantity + $quantity,
                    'out' => max(0, $previousQuantity - $quantity),
                    'adjustment' => $quantity,
                    default => throw new \InvalidArgumentException("Invalid stock movement type: $type"),
                };

                $variant->update(['stock_quantity' => $finalQuantity]);

                return \App\Models\StockMovement::create([
                    'user_id' => $extra['user_id'] ?? Auth::id(),
                    'store_id' => $storeId,
                    'product_variant_id' => $variant->id,
                    'order_item_id' => $extra['order_item_id'] ?? null,
                    'type' => $type,
                    'quantity' => $quantity,
                    'previous_quantity' => $previousQuantity,
                    'final_quantity' => $finalQuantity,
                    'reason' => $extra['reason'] ?? null,
                ]);
            });

            return ['success' => true, 'data' => $stockMovement];
        } catch (\Throwable $th) {
            return ['success' => false, 'error' => $th->getMessage()];
        }
    }
}
