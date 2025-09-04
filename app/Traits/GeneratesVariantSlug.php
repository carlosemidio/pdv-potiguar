<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesVariantSlug
{
    public function generateSlugFromAttributes($productName, $attributes)
    {
        $slugParts = [Str::slug($productName)];

        foreach ($attributes as $value) {
            $slugParts[] = Str::slug($value);
        }

        return implode('-', $slugParts);
    }
}
