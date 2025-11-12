import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cleanNotifications } from "@mantine/notifications";

import { authFetch } from "@utils/authFetch";
import { transformSessionDate } from "@utils/formatDate";
import { ShowErrorNotification } from "@utils/showErrorNotification";

import type { LoginScheme, UserScheme, SessionDetails } from "./schema";


export function loginUser() {
    return useMutation({
        mutationFn: async (credentials: LoginScheme) => {
            try {
                credentials.deviceName = navigator.platform;
                const response = await fetch(`/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`Error logging in: ${response.status} ${response.statusText}`);

                cleanNotifications();
                window.location.href = "/#/";
                return response.ok;
            } catch (error) {
                return ShowErrorNotification("Network error logging in: " + error);
            }
            
        }
    });
}

export function register() {
    return useMutation({
        mutationFn: async (newUser: LoginScheme) => {
            try {
                newUser.deviceName = navigator.platform;
                const response = await fetch(`/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`Error creating user: ${response.status} ${response.statusText}`);
                
                cleanNotifications();
                window.location.href = "/#/";
                return response.ok;
            } catch (error) {
                return ShowErrorNotification("Network error creating user: " + error);
            }
        }
    });
}

export function logoutUser() {
    return useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`/api/auth/logout`, { method: 'POST', credentials: 'include' });
                if (!response.ok) throw new Error("Error logging out");

            } catch (error) {
                return ShowErrorNotification("Network error logging out: " + error);
            }

            cleanNotifications();
            return;
        }
    });

}

export function deleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/auth`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification("Error deleting user: " + result.title);

            console.log("User deleted:", result);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            cleanNotifications();
            return result;
        }
    });
}

export function getAccountData() {
    return useQuery({
        queryKey: ["userData"],
        queryFn: async () => {
            const result = await authFetch({method: 'GET', route: '/account', errorText: "Error getting user data"});

            const user: UserScheme = result.user;
            const sessions: SessionDetails[] = result.sessions.map((session: SessionDetails) => (transformSessionDate(session)));
            return { user, sessions };
        },
        retry: false,
    });
}

export function revokeSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: number) => {
            try {
                const response = await fetch(`/api/auth/revoke/${sessionId}`, { method: 'POST', credentials: 'include' });
                if (!response.ok) return ShowErrorNotification("Error revoking session: " + response.statusText + response.status);

                console.log("Session revoked");
                queryClient.invalidateQueries({ queryKey: ['userData'] });
                cleanNotifications();
                return response.ok;
            } catch (error) {
                return ShowErrorNotification("Network error revoking session: " + error);
            }
        }
    });
}

export function getUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {

            const response = await fetch(`/api/users`, {method: "GET"});
            const result = await response.json();

            if (!response.ok) return ShowErrorNotification("Error getting users: " + result.title);

            console.log("Fetched users:", result);
            cleanNotifications();
            return result;
        },
        retry: false,
    });
}