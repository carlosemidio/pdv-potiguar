<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StoresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        Store::create([
            'user_id' => 2,
            'name' => 'Loja teste 1',
            'slug' => Str::slug('Loja teste 1'),
            'email' => 'test1@email.com',
            'phone' => '11999999999',
            'domain' => 'lojateste1.com',
            'description' => 'Esta é uma loja de teste.',
            'content' => 'Conteúdo da loja de teste 1 com informações adicionais.',
            'latitude' => -23.550520,
            'longitude' => -46.633308,
            'status' => 1,
            'is_default' => 1
        ]);

        Store::create([
            'user_id' => 2,
            'name' => 'Loja Teste 2',
            'slug' => Str::slug('Loja Teste 2'),
            'email' => 'test2@email.com',
            'phone' => '11999999998',
            'domain' => 'lojateste2.com',
            'description' => 'Esta é outra loja de teste.',
            'content' => 'Conteúdo da loja de teste 2 com informações adicionais.',
            'latitude' => -23.550520,
            'longitude' => -46.633308,
            'status' => 1,
            'is_default' => 0
        ]);

        Store::create([
            'user_id' => 3,
            'name' => 'Restaurante Teste',
            'slug' => Str::slug('Restaurante Teste'),
            'email' => 'restaurante@teste.com',
            'phone' => '11999999997',
            'domain' => 'restaurante.com',
            'description' => 'Este é um restaurante de teste.',
            'content' => 'Conteúdo do restaurante de teste com informações adicionais.',
            'latitude' => -23.550520,
            'longitude' => -46.633308,
            'status' => 1,
            'is_default' => 0
        ]);
    }
}
