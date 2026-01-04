import { useCookies } from "react-cookie";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authFetch } from "@api/fetchService";

import { transformSessionDate } from "@utils/formatDate";

import type { UserScheme, SessionDetails } from "@schema/user";


export function getUsers() {
    const [cookies] = useCookies(['userId']);

    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            return await authFetch({method: 'GET', route: '/users', errorText: "Error getting users"});
        },
        retry: false,
        enabled: !!cookies.userId,
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
            const result = await authFetch({method: 'DELETE', route: '/account', errorText: "Error deleting user"});

            queryClient.clear();
            window.location.href = "/";
            window.location.reload();
            return result;
        }
    });
}
