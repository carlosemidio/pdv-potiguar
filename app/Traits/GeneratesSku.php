<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesSku
{
    /**
     * Boot the trait to generate SKU automatically.
     */
    protected static function bootGeneratesSku()
    {
        static::creating(function ($variant) {
            // Se já tiver SKU definido manualmente, não sobrescreve
            if (!empty($variant->sku)) {
                return;
            }

            $tenantId = $variant->product->tenant_id;

            // Prefixo do produto: 3 primeiras letras
            $productPrefix = strtoupper(substr($variant->product->name, 0, 3));

            // Prefixo da variante: 3 primeiras letras do nome ou atributo
            $variantPrefix = strtoupper(substr(explode(' - ', $variant->name)[1], 0, 3));

            // Busca o último SKU para o mesmo tenant + prefixos
            $lastSku = self::whereHas('product', function ($q) use ($tenantId) {
                    $q->where('tenant_id', $tenantId);
                })
                ->where('sku', 'like', "{$productPrefix}-{$variantPrefix}-%")
                ->orderByDesc('id')
                ->value('sku');

            $nextSeq = 1;

            if ($lastSku) {
                $parts = explode('-', $lastSku);
                $lastSeq = (int) end($parts);
                $nextSeq = $lastSeq + 1;
            }

            // SKU final
            $variant->sku = "{$productPrefix}-{$variantPrefix}-" . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);
        });
    }
}
