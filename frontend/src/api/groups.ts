import { useCookies } from "react-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authFetch } from "@api/authFetch";

import { transformGroupDate, transformInboxGroupDate, transformMemberDate } from "@utils/formatDate";

import type { GroupFormScheme, GroupMemberScheme, InboxGroupScheme } from "@schema/groups";


export function getInboxGroups() {
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
        refetchInterval: (query) => { return query.state.status === 'error' ? false : 3000 }
    });
}

export function getGroupById(groupId: number) {
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

export function leaveGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (groupId: number) => {

            const result = await authFetch({
                method: 'PATCH',
                route: `/groups/${groupId}/leave`,
                errorText: "Error leaving group"
            });

            queryClient.invalidateQueries({ queryKey: ['inboxGroups'] });
            return transformInboxGroupDate(result);
        }
    })
}

export function transferOewnership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({groupId, newOwnerId}: {groupId: number, newOwnerId: number}) => {

            const result = await authFetch({
                method: 'PATCH',
                route: `/groups/${groupId}/transfer`,
                body: { id: newOwnerId },
                errorText: "Error transferring group ownership"
            });

            queryClient.invalidateQueries({ queryKey: ['inboxGroups'] });
            queryClient.invalidateQueries({ queryKey: ['group', groupId] });
            queryClient.invalidateQueries({ queryKey: ['groupMembers', groupId] });
            return transformInboxGroupDate(result);
        }
    })
}

export function deleteGroup() {
    return groupMutation({method: 'DELETE', errorText: "Error deleting group"});
}

function groupMutation({method, errorText} : {method: string, errorText: string}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({body, groupId}: {body: GroupFormScheme, groupId?: number}) => {

            var route = '/groups';
            if (groupId) route += `/${groupId}`;
            const result = await authFetch({ method, route, body, errorText });

            queryClient.invalidateQueries({ queryKey: ['inboxGroups'] });
            if (method !== 'DELETE') {
                queryClient.invalidateQueries({ queryKey: ['group', result.id] });
                queryClient.invalidateQueries({ queryKey: ['groupMembers', result.id] });
            }
            return transformInboxGroupDate(result);
        }
    })
}