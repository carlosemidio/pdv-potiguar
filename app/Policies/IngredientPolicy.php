<?php

namespace App\Policies;

use App\Models\Ingredient;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IngredientPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'ingredients';
    }

    public function view(User $user, Ingredient $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Ingredient $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Ingredient $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}