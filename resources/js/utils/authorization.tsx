import { usePage } from '@inertiajs/react';

export function can(permission: string, idsArray?: number[]): boolean {
    const userPermissions = usePage().props.auth.userPermissions;
    
    if (userPermissions == null) {
        return false
    }

    let hasPermission = Object.values(userPermissions).includes(permission);

    return hasPermission;
}