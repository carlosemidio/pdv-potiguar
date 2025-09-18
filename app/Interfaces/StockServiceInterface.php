<?php

namespace App\Interfaces;

use App\Models\ProductVariant;

interface StockServiceInterface
{
    public static function move(int $storeId, ProductVariant $variant, float $quantity, string $type, array $extra = []): array;
}
