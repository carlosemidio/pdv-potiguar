<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        $citiesArray = config('cities');
        $cities = [];

        foreach ($citiesArray as $data) {
            $city['name'] = $data['nome'];
            $city['slug'] = Str::slug($data['nome'], '-');
            $city['code'] = strtoupper($data['codigo_ibge']);
            $city['uf'] = strtoupper($data['codigo_uf']);
            $city['latitude'] = isset($data['latitude']) ? (string)$data['latitude'] : null;
            $city['longitude'] = isset($data['longitude']) ? (string)$data['longitude'] : null;
            $cities[] = $city;
        }

        foreach (array_chunk($cities, 1000) as $chunk) {
            DB::table('cities')->insert($chunk);
        }
    }
}
