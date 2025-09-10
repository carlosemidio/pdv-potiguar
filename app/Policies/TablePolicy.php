<?php

namespace App\Policies;

use App\Models\Table;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TablePolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'tables';
    }

    public function view(User $user, Table $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Table $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Table $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}