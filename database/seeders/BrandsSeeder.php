<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BrandsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        $brandsList = config('brands');
        $brands = [];

        foreach ($brandsList as $data) {
            $brand['name'] = $data;
            $brand['slug'] = Str::slug($data, '-');
            $brands[] = $brand;
        }

        foreach (array_chunk($brands, 1000) as $chunk) {
            DB::table('brands')->insert($chunk);
        }
    }
}
