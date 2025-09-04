<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'products';
    }

    public function view(User $user, Product $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Product $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Product $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}