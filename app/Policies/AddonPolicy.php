<?php

namespace App\Policies;

use App\Models\Addon;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AddonPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'addons';
    }

    public function view(User $user, Addon $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Addon $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Addon $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}