interface User {
    id: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role?: "USER" | "ADMIN";
    avatar?: string;
    phone?: string;
    created_at: string;
}

export type { User };