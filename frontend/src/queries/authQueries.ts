import { cleanNotifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { ShowErrorNotification } from "../errors/ShowErrorNotification";
import type { LoginScheme } from "../types/userScheme";

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