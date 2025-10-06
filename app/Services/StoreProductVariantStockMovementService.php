<?php

namespace App\Services;

use App\Enums\StockMovementSubtype;
use App\Models\OrderItem;
use App\Models\StoreProductVariant;

class StoreProductVariantStockMovementService
{
    protected $stockMovementService;

    public function __construct(StockMovementService $stockMovementService)
    {
        $this->stockMovementService = $stockMovementService;
    }

    /**
     * Registra os movimentos de estoque para os itens do pedido.
     *
     * @param StoreProductVariant $storeProductVariant
     * @return void
    */
    public function stockMovementOutFromVariant(StoreProductVariant $storeProductVariant, OrderItem $orderItem) {
        if ($orderItem->order == null) {
            $orderItem->load('order');
        }
        
        if (!$storeProductVariant->is_produced) {
            $this->stockMovementService->register(
                $orderItem->order->user_id,
                $orderItem->order->tenant_id,
                $orderItem->order->store_id,
                get_class($storeProductVariant),
                $storeProductVariant->id,
                $orderItem->quantity,
                StockMovementSubtype::SALE,
                $orderItem->cost_price,
                "Produto vendido: {$storeProductVariant->productVariant->name} (Pedido #{$orderItem->order->number})",
                null,
                null
            );
        } else {
            $storeProductVariant->load(
                'productVariant',
                'variantIngredients.ingredient',
                'variantIngredients.unit',
                'comboItems.itemVariant.productVariant'
            );

            if (count($storeProductVariant->variantIngredients) > 0) {
                foreach ($storeProductVariant->variantIngredients as $variantIngredient) {
                    $this->stockMovementService->register(
                        $orderItem->order->user_id,
                        $orderItem->order->tenant_id,
                        $orderItem->order->store_id,
                        get_class($variantIngredient->ingredient),
                        $variantIngredient->ingredient->id,
                        ($variantIngredient->quantity * $orderItem->quantity),
                        StockMovementSubtype::SALE,
                        $variantIngredient->ingredient->cost_price,
                        "Ingrediente no produto: {$storeProductVariant->productVariant->name} (Pedido #{$orderItem->order->number})",
                        null,
                        $variantIngredient->unit
                    );
                }
            }

            if (count($storeProductVariant->comboItems) > 0) {
                foreach ($storeProductVariant->comboItems as $comboItem) {
                    if ($comboItem->itemVariant && $comboItem->itemVariant->productVariant) {
                        if (!$comboItem->itemVariant->is_produced) {
                            $this->stockMovementService->register(
                                $orderItem->order->user_id,
                                $orderItem->order->tenant_id,
                                $orderItem->order->store_id,
                                get_class($comboItem->itemVariant),
                                $comboItem->itemVariant->id,
                                ($comboItem->quantity * $orderItem->quantity),
                                StockMovementSubtype::SALE,
                                $comboItem->itemVariant->cost_price,
                                "Produto vendido no combo: {$storeProductVariant->productVariant->name} (Pedido #{$orderItem->order->number})",
                                null,
                                null
                            );
                        } else {
                            if (count($comboItem->itemVariant->variantIngredients) > 0) {
                                foreach ($comboItem->itemVariant->variantIngredients as $variantIngredient) {
                                    $this->stockMovementService->register(
                                        $orderItem->order->user_id,
                                        $orderItem->order->tenant_id,
                                        $orderItem->order->store_id,
                                        get_class($variantIngredient->ingredient),
                                        $variantIngredient->ingredient->id,
                                        ($variantIngredient->quantity * $comboItem->quantity * $orderItem->quantity),
                                        StockMovementSubtype::SALE,
                                        $variantIngredient->ingredient->cost_price,
                                        "Ingrediente no produto: {$comboItem->itemVariant->productVariant->name} do combo: {$storeProductVariant->productVariant->name} (Pedido #{$orderItem->order->number})",
                                        null,
                                        $variantIngredient->unit
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
