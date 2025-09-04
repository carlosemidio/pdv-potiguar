<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RolePolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'roles';
    }

    public function view(User $user, Role $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Role $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Role $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}