<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\VariantAttribute;
use Illuminate\Database\Seeder;
use App\Models\ProductVariant;
use App\Models\AttributeValue;
use App\Models\File;
use Illuminate\Support\Str;
use App\Models\ProductVariantImage;

class ProductVariantSeeder extends Seeder
{
    public function run()
    {
        // Define possible attributes and values
        $attributes = [
            'Cor' => ['Azul', 'Branco', 'Preto', 'Vermelho', 'Verde'],
            'Tamanho' => ['P', 'M', 'G', 'GG'],
            'Estampa' => ['Lisa', 'Listrada', 'Estampada'],
            'Material' => ['Algodão', 'Poliéster', 'Linho'],
        ];

        // Create VariantAttributes if not exist
        $attributeModels = [];
        
        foreach (array_keys($attributes) as $attrName) {
            $attributeModels[$attrName] = VariantAttribute::firstOrCreate(['name' => $attrName]);
        }

        for ($i = 1; $i <= 10; $i++) {
            $product = Product::create([
                'user_id' => 2,
                'store_id' => $i <= 5 ? 1 : 2,
                'category_id' => 1,
                'brand_id' => 1,
                'sku' => strtoupper(Str::random(8)),
                'name' => 'Produto ' . $i,
                'short_description' => 'Descrição curta do produto ' . $i,
                'description' => 'Descrição longa do produto ' . $i,
                'price' => rand(30, 100),
                'stock_quantity' => rand(10, 100),
                'slug' => Str::slug('Produto ' . $i),
            ]);

            // Randomly pick 1-3 attributes for this product
            $usedAttributes = array_rand($attributes, rand(1, 3));
            if (!is_array($usedAttributes)) $usedAttributes = [$usedAttributes];

            // Generate combinations for variants
            $variantCombinations = [[]];
            foreach ($usedAttributes as $attrKey) {
                $values = $attributes[$attrKey];
                $newCombinations = [];
                foreach ($variantCombinations as $comb) {
                    foreach ($values as $val) {
                        $newCombinations[] = array_merge($comb, [$attrKey => $val]);
                    }
                }
                $variantCombinations = $newCombinations;
            }

            // Limit number of variants per product (max 5)
            shuffle($variantCombinations);
            $variantCombinations = array_slice($variantCombinations, 0, rand(1, 5));

            foreach ($variantCombinations as $combination) {
                $slug = Str::slug($product->name . '-' . implode('-', array_values($combination)));
                $variant = ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' => strtoupper(Str::random(8)),
                    'price' => rand(40, 120),
                    'stock_quantity' => rand(5, 30),
                    'slug' => $slug,
                ]);

                foreach ($combination as $attr => $value) {
                    AttributeValue::create([
                        'product_variant_id' => $variant->id,
                        'variant_attribute_id' => $attributeModels[$attr]->id,
                        'value' => $value,
                    ]);
                }

                // Add 1-3 images per variant
                $numImages = rand(1, 3);
                for ($img = 1; $img <= $numImages; $img++) {
                    $file = new File([
                        'user_id' => 2,
                        'name' => 'Imagem ' . $img . ' do produto ' . $i,
                        'size' => rand(1000, 5000),
                        'url' => 'https://picsum.photos/seed/' . uniqid() . '/600/600',
                        'extension' => 'jpg',
                        'is_default' => $img === 1, // First image is default
                    ]);

                    $variant->images()->save($file);
                }
            }
        }
    }
}
