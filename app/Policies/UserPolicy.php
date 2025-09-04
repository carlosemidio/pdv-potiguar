<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'users';
    }

    public function view(User $user, User $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, User $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, User $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}