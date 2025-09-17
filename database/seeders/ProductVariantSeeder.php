<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\VariantAttribute;
use Illuminate\Database\Seeder;
use App\Models\ProductVariant;
use App\Models\AttributeValue;
use App\Models\File;
use Illuminate\Support\Str;

class ProductVariantSeeder extends Seeder
{
    public function run()
    {
        // Atributos e valores realistas
        $attributes = [
            'Cor' => ['Azul', 'Branco', 'Preto', 'Vermelho', 'Verde'],
            'Tamanho' => ['P', 'M', 'G', 'GG'],
            'Estampa' => ['Lisa', 'Listrada', 'Estampada'],
            'Material' => ['Algodão', 'Poliéster', 'Linho'],
        ];

        $attributeModels = [];
        foreach (array_keys($attributes) as $attrName) {
            $attributeModels[$attrName] = VariantAttribute::firstOrCreate(['name' => $attrName]);
        }

        // Produtos de vestuário
        $productsData = [
            [
                'name' => 'Camiseta Básica',
                'short_description' => 'Camiseta confortável de algodão.',
                'description' => 'Camiseta básica feita 100% em algodão, ideal para o dia a dia.',
                'category_id' => 1,
                'brand_id' => 1,
            ],
            [
                'name' => 'Camisa Polo',
                'short_description' => 'Camisa polo elegante.',
                'description' => 'Camisa polo com acabamento premium, disponível em várias cores.',
                'category_id' => 1,
                'brand_id' => 2,
            ],
            [
                'name' => 'Calça Jeans',
                'short_description' => 'Calça jeans masculina.',
                'description' => 'Calça jeans de alta qualidade, corte reto.',
                'category_id' => 1,
                'brand_id' => 3,
            ],
            [
                'name' => 'Vestido Floral',
                'short_description' => 'Vestido feminino estampado.',
                'description' => 'Vestido leve com estampa floral, perfeito para o verão.',
                'category_id' => 1,
                'brand_id' => 4,
            ],
            [
                'name' => 'Jaqueta Corta Vento',
                'short_description' => 'Jaqueta leve para dias frios.',
                'description' => 'Jaqueta corta vento impermeável, ideal para atividades ao ar livre.',
                'category_id' => 1,
                'brand_id' => 5,
            ],
        ];

        foreach ($productsData as $i => $data) {
            $product = Product::create([
                'user_id' => 2,
                'store_id' => 1,
                'category_id' => $data['category_id'],
                'brand_id' => $data['brand_id'],
                'name' => $data['name'],
                'short_description' => $data['short_description'],
                'description' => $data['description'],
            ]);

            // Seleciona atributos relevantes para cada produto
            $usedAttributes = ['Cor', 'Tamanho'];
            if ($data['name'] === 'Vestido Floral') {
                $usedAttributes[] = 'Estampa';
            }
            if ($data['name'] === 'Jaqueta Corta Vento') {
                $usedAttributes[] = 'Material';
            }

            // Gera combinações de variantes
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

            // Limita variantes por produto
            shuffle($variantCombinations);
            $variantCombinations = array_slice($variantCombinations, 0, 4);

            $uniqueCombinations = [];
            foreach ($variantCombinations as $combination) {
                // Garante que todos os atributos estejam presentes
                $missing = array_diff($usedAttributes, array_keys($combination));
                if (count($missing) > 0) {
                    continue;
                }
                // Garante que não haja duplicidade
                $combKey = implode('|', array_map(function($attr) use ($combination) {
                    return $attr . ':' . $combination[$attr];
                }, $usedAttributes));
                if (in_array($combKey, $uniqueCombinations)) {
                    continue;
                }
                $uniqueCombinations[] = $combKey;

                $slug = Str::slug($product->name . '-' . implode('-', array_values($combination)));
                $variant = ProductVariant::create([
                    'slug' => $slug,
                    'store_id' => $product->store_id,
                    'product_id' => $product->id,
                    'sku' => strtoupper(Str::random(8)),
                    'cost_price' => rand(35, 60),
                    'price' => rand(69, 129),
                    'stock_quantity' => rand(10, 50),
                ]);

                foreach ($usedAttributes as $attr) {
                    AttributeValue::create([
                        'product_variant_id' => $variant->id,
                        'variant_attribute_id' => $attributeModels[$attr]->id,
                        'value' => $combination[$attr],
                    ]);
                }

                // Imagens realistas
                $images = [
                    [
                        'name' => $product->name . ' - Frente',
                        'url' => 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
                        'is_default' => true,
                    ],
                    [
                        'name' => $product->name . ' - Detalhe',
                        'url' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
                        'is_default' => false,
                    ],
                    [
                        'name' => $product->name . ' - Costas',
                        'url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
                        'is_default' => false,
                    ],
                ];

                foreach (array_slice($images, 0, rand(1, 3)) as $img) {
                    $file = new File([
                        'user_id' => 2,
                        'name' => $img['name'],
                        'size' => rand(1200, 3500),
                        'url' => $img['url'],
                        'extension' => 'jpg',
                        'is_default' => $img['is_default'],
                    ]);
                    $variant->images()->save($file);
                }
            }
        }

        // Produtos alimentícios sem variantes
        $foodProducts = [
            [
                'name' => 'Biscoito Integral',
                'short_description' => 'Biscoito saudável de fibras.',
                'description' => 'Biscoito integral rico em fibras, ideal para lanches.',
            ],
            [
                'name' => 'Suco Natural',
                'short_description' => 'Suco de frutas sem conservantes.',
                'description' => 'Suco natural feito com frutas selecionadas.',
            ],
            [
                'name' => 'Barra de Cereal',
                'short_description' => 'Barra energética.',
                'description' => 'Barra de cereal com castanhas e mel.',
            ],
            [
                'name' => 'Iogurte Grego',
                'short_description' => 'Iogurte cremoso.',
                'description' => 'Iogurte grego sabor natural, fonte de proteína.',
            ],
            [
                'name' => 'Granola Premium',
                'short_description' => 'Granola crocante.',
                'description' => 'Granola premium com frutas secas e sementes.',
            ],
        ];

        foreach ($foodProducts as $j => $data) {
            $product = Product::create([
                'user_id' => 3,
                'store_id' => 3,
                'category_id' => 2,
                'brand_id' => 1,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'short_description' => $data['short_description'],
                'description' => $data['description'],
            ]);

            ProductVariant::create([
                'store_id' => $product->store_id,
                'product_id' => $product->id,
                'sku' => $product->sku,
                'cost_price' => rand(3, 8),
                'price' => rand(6, 15),
                'stock_quantity' => rand(30, 200),
            ]);
        }
    }
}
