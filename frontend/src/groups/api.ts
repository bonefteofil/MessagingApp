import { useCookies } from "react-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { transformGroupDate } from "@utils/formatDate";
import { authFetch } from "@utils/authFetch";

import type GroupScheme from "./schema";


export function getGroups() {
    const [cookies] = useCookies(['userId']);

    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const result = await authFetch({method: 'GET', route: '/groups', errorText: "Error fetching groups"});

            const groupsWithLocalTime = result.map((group: GroupScheme) => transformGroupDate(group));
            console.log("Fetched groups:", groupsWithLocalTime);
            return groupsWithLocalTime;
        },
        retry: false,
        enabled: !!cookies.userId,
        refetchInterval: 3000
    });
}

export function createGroup() {
    return groupMutation({method: 'POST', consoleMessage: "Group created:", errorText: "Error creating group"});
}

export function editGroup() {
    return groupMutation({method: 'PUT', consoleMessage: "Group updated:", errorText: "Error updating group"});
}

export function deleteGroup() {
    return groupMutation({method: 'DELETE', consoleMessage: "Group deleted:", errorText: "Error deleting group"});
}

function groupMutation({method, consoleMessage, errorText} : {method: string, consoleMessage: string, errorText: string}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (groupBody: GroupScheme) => {
            const result = await authFetch({method: method, route: '/groups', errorText: errorText, body: groupBody});

            console.log(consoleMessage, transformGroupDate(result));
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            return transformGroupDate(result);
        }
    })
}