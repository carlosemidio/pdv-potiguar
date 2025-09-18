<?php

namespace App\Policies;

use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductVariantPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'product-variants';
    }

    public function view(User $user, ProductVariant $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, ProductVariant $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, ProductVariant $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}