<?php

namespace App\Policies;

use App\Models\Printer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PrinterPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'printers';
    }

    public function view(User $user, Printer $item): Response
    {
        return $this->viewBase($user, $item);
    }

    public function update(User $user, Printer $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Printer $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}