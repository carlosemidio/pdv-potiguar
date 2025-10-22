<?php

namespace App\Policies;

use App\Models\CashRegister;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CashRegisterPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'cash-registers';
    }

    public function view(User $user, CashRegister $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, CashRegister $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, CashRegister $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}