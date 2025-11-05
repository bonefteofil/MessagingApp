import { useContext } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cleanNotifications } from "@mantine/notifications";

import { ShowErrorNotification } from "@utils/showErrorNotification";

import CurrentUserContext from "./Context";

import type { LoginScheme } from "./schema";


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
                const result = await response.json();
                if (!response.ok) return ShowErrorNotification("Error logging in: " + result);
                console.log("User logged in:", result);
                cleanNotifications();
                return result;
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
                const result = await response.json();
                if (!response.ok) return ShowErrorNotification("Error creating user: " + result.title);
                
                console.log("User created:", result);
                cleanNotifications();
                return result;
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
                if (!response.ok) return ShowErrorNotification("Error logging out");
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
    const { setCurrentUser } = useContext(CurrentUserContext);

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/auth`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification("Error deleting user: " + result.title);

            console.log("User deleted:", result);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setCurrentUser(null);
            cleanNotifications();
            return result;
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


export function FetchUserStatus() {
    return useQuery({
        queryKey: ["userStatus"],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (response.status === 401) return response.statusText;
                if (!response.ok) throw new Error(`Error fetching user status: ${response.status} ${response.statusText}`);
                return await response.json();
            } catch (error: any) {
                throw error;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
    })
}