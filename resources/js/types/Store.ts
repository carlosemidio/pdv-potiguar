import { City } from "./City";
import { Image } from "./image";
import { User } from "./User";

export type Store = {
    id: number;
    user_id: number;
    user: User;
    city: City;
    image: Image | null;
    images: Image[] | null;
    name: string;
    slug: string;
    email: string;
    phone: string;
    domain: string;
    latitude: string;
    longitude: string;
    description: string;
    content: string;
    status: number;
    created_at: string;
    updated_at: string;
};
