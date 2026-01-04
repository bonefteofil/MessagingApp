import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authFetch } from "@api/fetchService";

import { transformMessageDate } from "@utils/formatDate";

import type MessageScheme from "@schema/messages";


export function getMessages(groupId: string) {

    return useQuery({
        queryKey: ["messages", groupId],
        queryFn: async () => {
            const result = await authFetch({method: 'GET', route: `/groups/${groupId}/messages`, errorText: "Error fetching messages"});

            const messagesWithLocalTime = result.map((message: MessageScheme) => transformMessageDate(message));
            return messagesWithLocalTime;
        },
        retry: false,
        refetchInterval: (query) => { return query.state.status === 'error' ? false : 3000 }
    });
}

export function sendMessage() {
    return messageMutation({method: 'POST', errorText: "Error sending message"});
}

export function editMessage() {
    return messageMutation({method: 'PUT', errorText: "Error editing message"});
}

export function deleteMessage() {
    return messageMutation({method: 'DELETE', errorText: "Error deleting message"});
}

function messageMutation({method, errorText} : {method: string, errorText: string}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ body, messageId }: { body: MessageScheme, messageId?: number }) => {

            var route = `/groups/${body.groupId}/messages`;
            if (messageId) route += `/${messageId}`;
            const result = await authFetch({method, route, errorText, body});

            queryClient.invalidateQueries({ queryKey: ['messages', body.groupId] });
            queryClient.invalidateQueries({ queryKey: ['inboxGroups'] });
            return transformMessageDate(result);
        }
    })
}
