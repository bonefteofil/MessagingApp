import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cleanNotifications } from "@mantine/notifications";

import { ShowErrorNotification } from "@utils/showErrorNotification";

import type { LoginScheme } from "@schema/user";


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

export function revokeSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: number) => {
            try {
                const response = await fetch(`/api/auth/revoke/${sessionId}`, { method: 'POST', credentials: 'include' });
                if (!response.ok) return ShowErrorNotification("Error revoking session: " + response.statusText + response.status);

                queryClient.invalidateQueries({ queryKey: ['userData'] });
                cleanNotifications();
                return response.ok;
            } catch (error) {
                return ShowErrorNotification("Network error revoking session: " + error);
            }
        }
    });
}