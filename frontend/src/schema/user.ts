export interface UserScheme {
    id?: number;
    username: string;
}

export interface LoginScheme {
    username: string;
    password: string;
    deviceName?: string;
}

export interface SessionDetails {
    id: number;
    createdAt: string;
    expired: boolean;
    revoked: boolean;
    deviceName: string;
}