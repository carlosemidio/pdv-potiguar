<?php

namespace App\Policies;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class NotificationPolicy extends BasePolicy
{
    public function __construct()
    {
        $this->table_name = 'notifications';
    }

    public function view(User $user, Notification $item): Response
    {
        $permission = $user->hasPermission($this->table_name.'_view', false);

        if (!$permission) {
            return Response::deny('Você não tem permissão para atualizar este recurso.');
        }

        $notificationUsers = $item->users->pluck('id')->toArray();

        if ($permission && in_array($user->id, $notificationUsers)) {
            return Response::allow();
        }

        $superPermission = $user->hasPermission($this->table_name .'_view', true);

        if ($superPermission) {
            return Response::allow();
        }

        return Response::deny('Você não tem permissão para visualizar este recurso.');
    }

    public function update(User $user, Notification $item): Response
    {
        return $this->updateBase($user, $item);
    }

    public function delete(User $user, Notification $item): Response
    {
        return $this->deleteBase($user, $item);
    }
}