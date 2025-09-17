<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CustomerPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'customers';
    }

    public function view(User $user, Customer $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Customer $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Customer $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}