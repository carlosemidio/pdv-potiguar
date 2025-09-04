<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = config('permissions');

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission['name'].'_view',
                'display_name' => $permission['display_name'] . ' - Visualizar',
            ]);

            Permission::firstOrCreate([
                'name' => $permission['name'].'_create',
                'display_name' => $permission['display_name'] . ' - Criar',
            ]);

            Permission::firstOrCreate([
                'name' => $permission['name'].'_edit',
                'display_name' => $permission['display_name'] . ' - Editar',
            ]);

            Permission::firstOrCreate([
                'name' => $permission['name'].'_delete',
                'display_name' => $permission['display_name'] . ' - Deletar',
            ]);

            if (array_key_exists('extra', $permission) && is_array($permission['extra'])) {
                foreach ($permission['extra'] as $extra) {
                    Permission::firstOrCreate([
                        'name' => $permission['name'].'_'.$extra['name'],
                        'display_name' => $permission['display_name'] . ' - ' . $extra['display_name'],
                    ]);
                }
            }
        }
    }
}
