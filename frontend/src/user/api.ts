import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cleanNotifications } from "@mantine/notifications";
import { CurrentUserContext } from "./Context";
import { ShowErrorNotification } from "../shared/utils/showErrorNotification";
import type { LoginScheme, UserScheme } from "./schema";

export function loginUser() {
    return useMutation({
        mutationFn: async (credentials: LoginScheme) => {
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
        }
    });
}

export function register() {
    return useMutation({
        mutationFn: async (newUser: UserScheme) => {
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
        }
    });
}

export function logoutUser() {
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/auth/logout`, { method: 'POST', credentials: 'include' });
            if (!response.ok) return ShowErrorNotification("Error logging out");

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