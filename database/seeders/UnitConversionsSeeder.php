<?php

namespace Database\Seeders;

use App\Models\Unit;
use App\Models\UnitConversion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitConversionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = Unit::pluck('id', 'symbol');

        $conversions = [
            // Peso
            ['from' => 't', 'to' => 'kg', 'factor' => 1000],
            ['from' => 'kg', 'to' => 'g', 'factor' => 1000],
            ['from' => 'g', 'to' => 'kg', 'factor' => 0.001],

            // Volume
            ['from' => 'l', 'to' => 'ml', 'factor' => 1000],
            ['from' => 'ml', 'to' => 'l', 'factor' => 0.001],

            // Comprimento
            ['from' => 'km', 'to' => 'm', 'factor' => 1000],
            ['from' => 'm', 'to' => 'km', 'factor' => 0.001],
            ['from' => 'm', 'to' => 'cm', 'factor' => 100],
            ['from' => 'cm', 'to' => 'm', 'factor' => 0.01],
            ['from' => 'm', 'to' => 'mm', 'factor' => 1000],
            ['from' => 'mm', 'to' => 'm', 'factor' => 0.001],
            ['from' => 'cm', 'to' => 'mm', 'factor' => 10],
            ['from' => 'mm', 'to' => 'cm', 'factor' => 0.1],
        ];

        foreach ($conversions as $conv) {
            if (!isset($units[$conv['from']], $units[$conv['to']])) {
                continue;
            }

            UnitConversion::firstOrCreate(
                [
                    'from_unit_id' => $units[$conv['from']],
                    'to_unit_id'   => $units[$conv['to']],
                ],
                [
                    'user_id'      => 1,
                    'factor'       => $conv['factor'],
                ]
            );
        }
    }
}
