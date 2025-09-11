import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type MessageScheme from "../types/message";

const API_URL = import.meta.env.VITE_API_URL;

export function getMessages(groupId: number) {
    return useQuery({
        queryKey: ["messages", groupId],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/groups/${groupId}/messages`);
            const result = await response.json();

            if (!response.ok) {
                console.log("Error getting messages:", result.title);
                throw new Error(result.title);
            }

            const messagesWithLocalTime = result.map((message: MessageScheme) => {
                const date = new Date(message.createdAt!);
                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                return { ...message, createdAt: localDate.toISOString() };
            });
            console.log("Fetched messages:", messagesWithLocalTime);
            return messagesWithLocalTime;
        }
    });
}

export function sendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newMessage: any) => {
            const response = await fetch(`${API_URL}/groups/${newMessage.groupId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            });
            const result = await response.json();

            if (!response.ok) {
                console.log("Error sending message:", result.title);
                throw new Error(result.title);
            }
            console.log("Message sent:", result);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            return result;
        }
    });
}

export function editMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedMessage: MessageScheme) => {
            const response = await fetch(`${API_URL}/groups/${updatedMessage.groupId}/messages/${updatedMessage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMessage),
            });
            const result = await response.json();

            if (!response.ok) {
                console.log("Error editing message:", result.title);
                throw new Error(result.title);
            }
            console.log("Message edited:", result);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            return result;
        }
    });
}

export function deleteMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message: MessageScheme) => {
            const response = await fetch(`${API_URL}/groups/${message.groupId}/messages/${message.id}`, { method: 'DELETE' });
            const result = await response.json();
            
            if (!response.ok) {
                console.log("Error deleting message:", result.title);
                throw new Error(result.title);
            }
            console.log("Deleted message:", result);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            return result;
        },
    });
}
