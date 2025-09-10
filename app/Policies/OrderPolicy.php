<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'orders';
    }

    public function view(User $user, Order $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Order $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Order $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}