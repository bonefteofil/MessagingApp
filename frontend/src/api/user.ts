import { useCookies } from "react-cookie";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cleanNotifications } from "@mantine/notifications";

import { authFetch } from "@api/authFetch";

import { transformSessionDate } from "@utils/formatDate";
import { ShowErrorNotification } from "@utils/showErrorNotification";

import type { UserScheme, SessionDetails } from "@schema/user";


export function getUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            return await authFetch({method: 'GET', route: '/users', errorText: "Error getting users"});
        },
        retry: false
    });
}

export function getAccountData() {
    const [cookies] = useCookies(['userId']);
    
    return useQuery({
        queryKey: ["userData"],
        queryFn: async () => {
            const result = await authFetch({method: 'GET', route: '/account', errorText: "Error getting user data"});
            
            const user: UserScheme = result.user;
            const sessions: SessionDetails[] = result.sessions.map((session: SessionDetails) => (transformSessionDate(session)));
            return { user, sessions };
        },
        retry: false,
        enabled: !!cookies.userId,
        refetchInterval: (query) => { return query.state.status === 'error' ? false : 3000 }
    });
}

export function deleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/account`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification("Error deleting user: " + result.title);

            queryClient.clear();
            cleanNotifications();
            return result;
        }
    });
}
