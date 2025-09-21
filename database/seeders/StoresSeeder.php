<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StoresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        $byRenataPlusUser = User::where('email', 'renatapinheiro@email.com')->first();
        $kalineModasUser = User::where('email', 'kalinemodas@email.com')->first();
        $pizariaImperialUser = User::where('email', 'ricardo@email.com')->first();
    
        Store::create([
            'user_id' => $byRenataPlusUser->id,
            'tenant_id' => $byRenataPlusUser->tenant_id,
            'name' => 'By Renata plus',
            'slug' => Str::slug('By Renata plus'),
            'email' => 'renatapinheiro@email.com',
            'phone' => '84999999999',
            'domain' => 'byrenataplus.com.br',
            'description' => 'Moda plus size feminina.',
            'content' => 'Loja de roupas femininas plus size com as últimas tendências da moda.',
            'latitude' => -5.794480,
            'longitude' => -35.211000,
            'status' => 1
        ]);

        Store::create([
            'user_id' => $kalineModasUser->id,
            'tenant_id' => $kalineModasUser->tenant_id,
            'name' => 'Kaline Modas',
            'slug' => Str::slug('Kaline Modas'),
            'email' => 'kalinemodas@email.com',
            'phone' => '84988888888',
            'domain' => 'kalinemodas.com.br',
            'description' => 'Moda feminina e masculina.',
            'content' => 'Loja de roupas femininas e masculinas com uma variedade de estilos.',
            'latitude' => -23.550520,
            'longitude' => -46.633308,
            'status' => 1
        ]);

        Store::create([
            'user_id' => $pizariaImperialUser->id,
            'tenant_id' => $pizariaImperialUser->tenant_id,
            'name' => 'Pizaria Imperial',
            'slug' => Str::slug('Pizaria Imperial'),
            'email' => 'ricardo@email.com',
            'phone' => '11999999997',
            'domain' => 'pizariaimperial.com',
            'description' => 'Pizzas artesanais e ingredientes frescos.',
            'content' => 'Pizzaria artesanal oferecendo uma variedade de pizzas feitas com ingredientes frescos e de alta qualidade.',
            'latitude' => -23.550520,
            'longitude' => -46.633308,
            'status' => 1,
        ]);

        $byRenataPlusUser->update(['store_id' => 1]);
        $kalineModasUser->update(['store_id' => 2]);
        $pizariaImperialUser->update(['store_id' => 3]);
    }
}
