<?php

namespace App\Policies;

use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StockMovementPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'stock-movements';
    }

    public function view(User $user, StockMovement $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, StockMovement $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, StockMovement $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}