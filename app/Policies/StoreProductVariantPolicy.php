<?php

namespace App\Policies;

use App\Models\StoreProductVariant;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StoreProductVariantPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'store-product-variants';
    }

    public function view(User $user, StoreProductVariant $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, StoreProductVariant $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, StoreProductVariant $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}