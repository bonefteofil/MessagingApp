import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShowError } from "../components/ShowError";
import { cleanNotifications } from "@mantine/notifications";
import type UserScheme from "../types/userScheme";
import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const API_URL = import.meta.env.VITE_API_URL;

export function getUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/users`, {method: "GET"});
            const result = await response.json();

            if (!response.ok) return ShowError("Error getting users: " + result.title);

            console.log("Fetched users:", result);
            cleanNotifications();
            return result;
        },
        retry: false,
    });
}

export function createUser() {
    return useMutation({
        mutationFn: async (newUser: UserScheme) => {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error creating user: " + result.title);
            
            console.log("User created:", result);
            cleanNotifications();
            return result;
        }
    });
}

export function deleteUser() {
    const queryClient = useQueryClient();
    const { setCurrentUser } = useContext(CurrentUserContext);

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok) return ShowError("Error deleting user: " + result.title);

            console.log("User deleted:", result);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setCurrentUser(null);
            cleanNotifications();
            return result;
        }
    });
}