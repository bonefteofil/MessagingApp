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
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${response.status} ${response.statusText} - ${errorData.title}`);
                }

                cleanNotifications();
                window.location.href = "/#/";
                return response.ok;
            } catch (error: any) {
                return ShowErrorNotification("Error logging in: " + error.message);
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
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${response.status} ${response.statusText} - ${errorData.title}`);
                }
                
                cleanNotifications();
                window.location.href = "/#/";
                return response.ok;
            } catch (error: any) {
                return ShowErrorNotification("Error creating user: " + error.message);
            }
        }
    });
}

export function logoutUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`/api/auth/logout`, { method: 'POST', credentials: 'include' });
                if (!response.ok) throw new Error("Error logging out");

            } catch (error) {
                return ShowErrorNotification("Network error logging out: " + error);
            }
            queryClient.clear()
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