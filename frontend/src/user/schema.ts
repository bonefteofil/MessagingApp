export interface UserScheme {
    id?: number;
    username: string;
}

export interface LoginScheme {
    username: string;
    deviceName?: string;
}

export interface SessionDetails {
    createdAt: string;
    expired: boolean;
    revoked: boolean;
    deviceName: string;
}