<?php

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BrandPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'brands';
    }

    public function view(User $user, Brand $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Brand $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Brand $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}