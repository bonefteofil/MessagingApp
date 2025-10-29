import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { transformMessageDate } from "@utils/formatDate";
import { authFetch } from "@utils/authFetch";

import CurrentGroupContext from "@groups/Context";

import type MessageScheme from "./schema";


export function getMessages() {
    const { currentGroup } = useContext(CurrentGroupContext);

    return useQuery({
        queryKey: ["messages", currentGroup?.id],
        queryFn: async () => {
            const result = await authFetch({method: 'GET', route: `/groups/${currentGroup?.id}/messages`, errorText: "Error fetching messages"});

            const messagesWithLocalTime = result.map((message: MessageScheme) => transformMessageDate(message));
            console.log("Fetched messages:", messagesWithLocalTime);
            return messagesWithLocalTime;
        },
        retry: false,
        enabled: !!currentGroup,
        refetchInterval: 3000
    });
}

export function sendMessage() {
    return messageMutation({method: 'POST', consoleMessage: "Message sent:", errorText: "Error sending message"});
}

export function editMessage() {
    return messageMutation({method: 'PUT', consoleMessage: "Message edited:", errorText: "Error editing message"});
}

export function deleteMessage() {
    return messageMutation({method: 'DELETE', consoleMessage: "Deleted message:", errorText: "Error deleting message"});
}

function messageMutation({method, consoleMessage, errorText} : {method: string, consoleMessage: string, errorText: string}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (messageBody: MessageScheme) => {
            const result = await authFetch({method: method, route: `/groups/${messageBody.groupId}/messages`, errorText: errorText, body: messageBody});

            console.log(consoleMessage, transformMessageDate(result));
            queryClient.invalidateQueries({ queryKey: ['messages', messageBody.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            return transformMessageDate(result);
        }
    })
}
