<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        $categoriesList = config('categories');
        $categories = [];

        foreach ($categoriesList as $data) {
            $category['name'] = $data;
            $category['slug'] = Str::slug($data, '-');
            $categories[] = $category;
        }

        foreach (array_chunk($categories, 1000) as $chunk) {
            DB::table('categories')->insert($chunk);
        }
    }
}
