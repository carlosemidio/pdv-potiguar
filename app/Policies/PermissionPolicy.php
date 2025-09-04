<?php

namespace App\Policies;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PermissionPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'permissions';
    }

    public function view(User $user, Permission $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Permission $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Permission $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}