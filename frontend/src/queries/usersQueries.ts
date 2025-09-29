import { useQuery } from "@tanstack/react-query";
import { ShowError } from "../components/ShowError";
import { cleanNotifications } from "@mantine/notifications";

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