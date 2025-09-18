<?php

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BrandPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'tenants';
    }

    public function viewAny(User $user): Response
    {
        return $user->hasPermission('tenants_view', true)
            ? Response::allow()
            : Response::deny('Você não possui permissão para visualizar empresas.');
    }

    public function view(User $user, Brand $item): Response
    {
        return $user->hasPermission('tenants_view', true)
            ? Response::allow()
            : Response::deny('Você não possui permissão para visualizar esta empresa.');
    }

    public function create(User $user): Response
    {
        return $user->hasPermission('tenants_create', true)
            ? Response::allow()
            : Response::deny('Você não possui permissão para criar empresas.');
    }

    public function update(User $user, Brand $item): Response
    {
        return $user->hasPermission('tenants_edit', true)
            ? Response::allow()
            : Response::deny('Você não possui permissão para editar esta empresa.');
    }

    public function delete(User $user, Brand $item): Response
    {
        return $user->hasPermission('tenants_delete', true)
            ? Response::allow()
            : Response::deny('Você não possui permissão para remover esta empresa.');
    }
}