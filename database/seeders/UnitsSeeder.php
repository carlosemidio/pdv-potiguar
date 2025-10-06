<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            ['user_id' => 1, 'name' => 'Quilograma', 'symbol' => 'kg'],
            ['user_id' => 1, 'name' => 'Grama', 'symbol' => 'g'],
            ['user_id' => 1, 'name' => 'Litro', 'symbol' => 'l'],
            ['user_id' => 1, 'name' => 'Mililitro', 'symbol' => 'ml'],
            ['user_id' => 1, 'name' => 'Unidade', 'symbol' => 'un'],
            ['user_id' => 1, 'name' => 'Quilometro', 'symbol' => 'km'],
            ['user_id' => 1, 'name' => 'Metro', 'symbol' => 'm'],
            ['user_id' => 1, 'name' => 'Centímetro', 'symbol' => 'cm'],
            ['user_id' => 1, 'name' => 'Milímetro', 'symbol' => 'mm'],
            ['user_id' => 1, 'name' => 'Caixa', 'symbol' => 'cx'],
            ['user_id' => 1, 'name' => 'Pacote', 'symbol' => 'pct'],
            ['user_id' => 1, 'name' => 'Fatia', 'symbol' => 'fat'],
            ['user_id' => 1, 'name' => 'Dose', 'symbol' => 'dose'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['symbol' => $unit['symbol']], $unit);
        }
    }
}
