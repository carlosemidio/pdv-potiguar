<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;

abstract class BasePolicy
{
    protected $table_name;

    public function __construct()
    {
        $this->table_name = 'base';
    }

    public function list(User $user): Response
    {
        return $user->hasPermission($this->table_name . '_view')
            ? Response::allow()
            : Response::deny('Você não tem permissão para visualizar estes recursos.');
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        return $user->hasPermission($this->table_name.'_view', true)
            ? Response::allow()
            : Response::deny('Você não tem permissão para visualizar estes recursos.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function viewBase(User $user, Model $item): Response
    {
        $permission = $user->hasPermission($this->table_name.'_view', false);

        if (!$permission) {
            return Response::deny('Você não tem permissão para visualizar este recurso.');
        }

        if ($permission && ($user->id == $item->user_id)) {
            return Response::allow();
        }

        $superPermission = $user->hasPermission($this->table_name. '_view', true);

        if ($superPermission) {
            return Response::allow();
        }

        return Response::deny('Você não tem permissão para visualizar este recurso.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->hasPermission($this->table_name.'_create')
        ? Response::allow()
            : Response::deny('Você não tem permissão para criar esse recurso.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function updateBase(User $user, Model $item): Response
    {
        $permission = $user->hasPermission($this->table_name.'_edit', false);

        if (!$permission) {
            return Response::deny('Você não tem permissão para atualizar este recurso.');
        }

        if ($permission && ($user->id == $item->user_id)) {
            return Response::allow();
        }

        $superPermission = $user->hasPermission($this->table_name .'_edit', true);

        if ($superPermission) {
            return Response::allow();
        }

        return Response::deny('Você não tem permissão para visualizar este recurso.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function deleteBase(User $user, Model $item): Response
    {
        $permission = $user->hasPermission($this->table_name .'_delete', false);

        if (!$permission) {
            return Response::deny('Você não tem permissão para deletar este recurso.');
        }

        if ($permission) {
            return Response::allow();
        }

        $superPermission = $user->hasPermission($this->table_name .'_delete', true);

        if ($superPermission) {
            return Response::allow();
        }

        return Response::deny('Você não tem permissão para visualizar este recurso.');
    }

}