import { useQuery } from "@tanstack/react-query";
import type UserScheme from "../types/userScheme";
import { ShowError } from "../components/ShowError";
import { cleanNotifications } from "@mantine/notifications";

const API_URL = import.meta.env.VITE_API_URL;

export function getUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/users`, {method: "GET"});
            const result = await response.json();

            if (!response.ok) {
                const error = new Error("Error getting users: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }

            console.log("Fetched users:", result);
            cleanNotifications();
            return result as UserScheme[];
        },
        retry: false,
    });
}