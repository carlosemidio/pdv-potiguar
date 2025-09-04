import { Config } from 'ziggy-js';
import { User } from './user';

export type PaginatedData<T> = {
    data: T[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
  
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    
        links: {
            url: null | string;
            label: string;
            active: boolean;
        }[];
    };
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        userPermissions: string[];
    };
    flash: {
        success: string | null;
        fail: string | null;
    };
    unreadNotificationsCount: number;
    ziggy: Config & { location: string };
};
