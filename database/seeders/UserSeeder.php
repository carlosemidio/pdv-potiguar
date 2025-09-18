<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        // Dev User
        $user_dev = User::updateOrCreate([
            'name' => 'dev',
            'email' => 'carlosemidiopereira@gmail.com',
            'user_id' => 1, // Assuming the first user is the dev user
        ], [ 'password' => bcrypt('123') ]);

        // Lojista
        $user_lojista = User::updateOrCreate([
            'name' => 'lojista',
            'email' => 'teste1@email.com',
            'user_id' => 1, // Assuming the second user is the lojista
        ], [ 'password' => bcrypt('123') ]);

        $user_restaurant = User::updateOrCreate([
            'name' => 'restaurant',
            'email' => 'teste2@email.com',
            'user_id' => 1, // Assuming the third user is the restaurant
        ], [ 'password' => bcrypt('123') ]);

        // Dev role
        $role_dev = Role::create([
            'name' => 'Dev',
            'user_id' => $user_dev->id,
        ]);

        $user_dev->roles()->attach($role_dev->id);

        // Lojista role
        $role_lojista = Role::create([
            'name' => 'Lojista',
            'user_id' => $user_lojista->id,
        ]);

        // Restaurant role
        $role_restaurant = Role::create([
            'name' => 'Restaurant',
            'user_id' => $user_restaurant->id,
        ]);

        // Permissions for Lojista
        $store_permissions = [
            'stores_view',
            'stores_create',
            'stores_edit',
            'products_view',
            'products_create',
            'products_edit',
            'products_delete',
            'product-variants_view',
            'product-variants_create',
            'product-variants_edit',
            'product-variants_delete',
            'store-product-variants_view',
            'store-product-variants_create',
            'store-product-variants_edit',
            'store-product-variants_delete',
            'cities_view',
            'categories_view',
            'categories_create',
            'categories_edit',
            'categories_delete',
            'brands_view',
            'brands_create',
            'brands_edit',
            'brands_delete',
            'customers_view',
            'customers_create',
            'customers_edit',
            'customers_delete',
            'orders_view',
            'orders_create',
            'orders_edit',
            'orders_delete',
            'payments_view',
            'payments_create',
            'payments_edit',
            'payments_delete',
            'stock-movements_view',
            'stock-movements_create',
            'stock-movements_edit',
            'stock-movements_delete',
        ];

        foreach ($store_permissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            $role_lojista->permissions()->attach($permission->id);
        }

        $user_lojista->roles()->attach($role_lojista->id);

        $restorant_permissions = [
            'stores_view',
            'stores_create',
            'stores_edit',
            'cities_view',
            'categories_view',
            'categories_create',
            'categories_edit',
            'categories_delete',
            'brands_view',
            'brands_create',
            'brands_edit',
            'brands_delete',
            'products_view',
            'products_create',
            'products_edit',
            'products_delete',
            'product-variants_view',
            'product-variants_create',
            'product-variants_edit',
            'product-variants_delete',
            'store-product-variants_view',
            'store-product-variants_create',
            'store-product-variants_edit',
            'store-product-variants_delete',
            'addons_view',
            'addons_create',
            'addons_edit',
            'addons_delete',
            'tables_view',
            'tables_create',
            'tables_edit',
            'tables_delete',
            'customers_view',
            'customers_create',
            'customers_edit',
            'customers_delete',
            'orders_view',
            'orders_create',
            'orders_edit',
            'orders_delete',
            'payments_view',
            'payments_create',
            'payments_edit',
            'payments_delete',
            'stock-movements_view',
            'stock-movements_create',
            'stock-movements_edit',
            'stock-movements_delete',
        ];

        // Permissions for Restaurant
        foreach ($restorant_permissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            $role_restaurant->permissions()->attach($permission->id);
        }

        $user_restaurant->roles()->attach($role_restaurant->id);
    }
}
