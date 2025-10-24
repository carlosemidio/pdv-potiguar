<?php

namespace App\Policies;

use App\Models\Menu;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MenuPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'menus';
    }

    public function view(User $user, Menu $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Menu $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Menu $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}