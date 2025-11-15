import { useCookies } from "react-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { transformGroupDate, transformInboxGroupDate, transformMemberDate } from "@utils/formatDate";
import { authFetch } from "@utils/authFetch";

import type { GroupFormScheme, GroupMemberScheme, InboxGroupScheme } from "./schema";


export function getInboxGroups() {
    const [cookies] = useCookies(['userId']);

    return useQuery({
        queryKey: ["inboxGroups"],
        queryFn: async () => {
            const result = await authFetch({
                method: 'GET',
                route: '/groups',
                errorText: "Error fetching groups"
            });

            const groupsWithLocalTime = result.map((group: InboxGroupScheme) => transformInboxGroupDate(group));
            return groupsWithLocalTime;
        },
        retry: false,
        enabled: !!cookies.userId,
        refetchInterval: (query) => { return query.state.status === 'error' ? false : 3000 }
    });
}

export function getGroupById(groupId: number) {
    const [cookies] = useCookies(['userId']);

    return useQuery({
        queryKey: ["group", groupId],
        queryFn: async () => {
            const result = await authFetch({
                method: 'GET',
                route: `/groups/${groupId}`,
                errorText: "Error fetching group by id"
            });

            const groupWithLocalTime = transformGroupDate(result);
            return groupWithLocalTime;
        },
        retry: false,
        enabled: !!cookies.userId,
    });
}

export function getGroupMembers(groupId: number) {
    const [cookies] = useCookies(['userId']);

    return useQuery({
        queryKey: ["groupMembers", groupId],
        queryFn: async () => {
            const result = await authFetch({
                method: 'GET',
                route: `/groups/${groupId}/members`,
                errorText: "Error fetching group members"
            });

            const membersWithLocalTime = result.map((member: GroupMemberScheme) => transformMemberDate(member));
            return membersWithLocalTime;
        },
        retry: false,
        enabled: !!cookies.userId,
    });
}

export function createGroup() {
    return groupMutation({method: 'POST', errorText: "Error creating group"});
}

export function editGroup() {
    return groupMutation({method: 'PUT', errorText: "Error editing group"});
}

export function deleteGroup() {
    return groupMutation({method: 'DELETE', errorText: "Error deleting group"});
}

function groupMutation({method, errorText} : {method: string, errorText: string}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({groupBody, groupId}: {groupBody: GroupFormScheme, groupId?: number}) => {

            var route = '/groups';
            if (groupId) route += `/${groupId}`;
            const result = await authFetch({
                method: method,
                route: route,
                body: groupBody,
                errorText: errorText
            });

            queryClient.invalidateQueries({ queryKey: ['inboxGroups'] });
            queryClient.invalidateQueries({ queryKey: ['group', result.id] });
            queryClient.invalidateQueries({ queryKey: ['groupMembers', result.id] });
            return transformInboxGroupDate(result);
        }
    })
}