<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StorePolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'stores';
    }

    public function view(User $user, Store $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Store $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Store $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}