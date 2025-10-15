<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserProductionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {       
        // Dev User
        $user_dev = User::updateOrCreate([
            'user_id' => 1, // Assuming the first user is the dev user
            'name' => 'dev',
            'email' => 'carlosemidiopereira@gmail.com',
        ], [ 'password' => bcrypt('123') ]);

        // Dev role
        $role_dev = Role::create([
            'user_id' => $user_dev->id,
            'name' => 'Dev',
        ]);

        $user_dev->roles()->attach($role_dev->id);   
    }
}