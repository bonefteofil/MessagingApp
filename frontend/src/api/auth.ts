import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cleanNotifications } from "@mantine/notifications";

import { ShowErrorNotification } from "@utils/showErrorNotification";

import type { LoginScheme } from "@schema/user";


export function loginUser() {
    return useMutation({
        mutationFn: async (credentials: LoginScheme) => {
            credentials.deviceName = navigator.platform;
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error logging in: ${errorData.title}`);
            }

            window.location.href = "/";
            window.location.reload();
            return response.ok;
        }
    });
}

export function register() {
    return useMutation({
        mutationFn: async (newUser: LoginScheme) => {
            newUser.deviceName = navigator.platform;
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error registering: ${errorData.title}`);
            }
            
            window.location.href = "/";
            window.location.reload();
            return response.ok;
        }
    });
}

export function logoutUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/auth/logout`, { method: 'POST', credentials: 'include' });
            
            cleanNotifications();
            queryClient.clear()
            window.location.reload();
            window.location.href = "/";
            if (!response.ok) throw new Error(`${response.status}`);
            return response.ok;
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
                return ShowErrorNotification("Error revoking session: " + error);
            }
        }
    });
}