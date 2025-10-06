<?php

namespace App\Services;

use App\Enums\StockMovementSubtype;
use App\Models\OrderItem;

class OrderItemStockMovementService
{
    protected $stockMovementService;
    protected $storeProductVariantStockMovementService;

    public function __construct(StockMovementService $stockMovementService, StoreProductVariantStockMovementService $storeProductVariantStockMovementService)
    {
        $this->stockMovementService = $stockMovementService;
        $this->storeProductVariantStockMovementService = $storeProductVariantStockMovementService;
    }

    /**
     * Registra os movimentos de estoque para os itens do pedido.
     *
     * @param OrderItem $orderItem
     * @return void
    */
    public function registerSaleFromOrderItem(OrderItem $orderItem) {
        $orderItem->load(
            'order',
            'orderItemOptions.addonGroupOption.addon.addonIngredients.ingredient',
            'orderItemOptions.addonGroupOption.addon.addonIngredients.unit',
            'storeProductVariant.comboItems.itemVariant.productVariant',
            'comboOptionItems.comboOptionItem.storeProductVariant.productVariant',
            'orderItemAddons.variantAddon.addon.addonIngredients.ingredient',
            'orderItemAddons.variantAddon.addon.addonIngredients.unit'
        );

        if ($orderItem->storeProductVariant && $orderItem->storeProductVariant->manage_stock) {
            $this->storeProductVariantStockMovementService->stockMovementOutFromVariant($orderItem->storeProductVariant, $orderItem);

            if (count($orderItem->orderItemOptions) > 0) {
                foreach ($orderItem->orderItemOptions as $option) {
                    if ($option->addonGroupOption && $option->addonGroupOption->addon && ($option->addonGroupOption->addon->addonIngredients->count() > 0)) {
                        foreach ($option->addonGroupOption->addon->addonIngredients as $addonIngredient) {
                            $this->stockMovementService->register(
                                $orderItem->order->user_id,
                                $orderItem->order->tenant_id,
                                $orderItem->order->store_id,
                                get_class($addonIngredient->ingredient),
                                $addonIngredient->ingredient->id,
                                ($addonIngredient->quantity * $option->quantity),
                                StockMovementSubtype::SALE,
                                $addonIngredient->ingredient->cost_price,
                                "Ingrediente na opção: {$option->addonGroupOption->addon->name} do produto: {$orderItem->storeProductVariant->productVariant->name} (Pedido #{$orderItem->order->number})",
                                null,
                                $addonIngredient->unit
                            );
                        }
                    }
                }
            }
        }

        if (count($orderItem->comboOptionItems) > 0) {
            foreach ($orderItem->comboOptionItems as $comboItem) {
                if ($comboItem->comboOptionItem && $comboItem->comboOptionItem->storeProductVariant && $comboItem->comboOptionItem->storeProductVariant->manage_stock) {
                    $this->storeProductVariantStockMovementService->stockMovementOutFromVariant($comboItem->comboOptionItem->storeProductVariant, $orderItem);
                }
            }
        }

        if (count($orderItem->orderItemAddons) > 0) {
            foreach ($orderItem->orderItemAddons as $variantAddon) {
                if ($variantAddon->variantAddon && $variantAddon->variantAddon->addon && ($variantAddon->variantAddon->addon->addonIngredients->count() > 0)) {
                    foreach ($variantAddon->variantAddon->addon->addonIngredients as $addonIngredient) {
                        $this->stockMovementService->register(
                            $orderItem->order->user_id,
                            $orderItem->order->tenant_id,
                            $orderItem->order->store_id,
                            get_class($addonIngredient->ingredient),
                            $addonIngredient->ingredient->id,
                            ($addonIngredient->quantity * $variantAddon->quantity),
                            StockMovementSubtype::SALE,
                            $addonIngredient->ingredient->cost_price,
                            "Ingrediente no adicional: {$variantAddon->variantAddon->addon->name} do produto: {$orderItem->storeProductVariant->productVariant->name} (Pedido #{$orderItem->order->number})",
                            null,
                            $addonIngredient->unit
                        );
                    }
                }
            }
        }
    }
}
