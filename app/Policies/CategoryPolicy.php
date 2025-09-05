<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CategoryPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'categories';
    }

    public function view(User $user, Category $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Category $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Category $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}