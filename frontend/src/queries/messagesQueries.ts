import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type MessageScheme from "../types/message";
import { ShowError } from "../components/ShowError";
import { cleanNotifications } from "@mantine/notifications";

const API_URL = import.meta.env.VITE_API_URL;

export function getMessages(groupId: number) {
    return useQuery({
        queryKey: ["messages", groupId],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/groups/${groupId}/messages`, {method: "GET"});
            const result = await response.json();

            if (!response.ok) {
                const error = new Error("Error getting messages: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }

            const messagesWithLocalTime = result.map((message: MessageScheme) => {
                const date = new Date(message.createdAt!);
                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                return { ...message, createdAt: localDate.toISOString() };
            });
            console.log("Fetched messages:", messagesWithLocalTime);
            cleanNotifications();
            return messagesWithLocalTime;
        },
        retry: false,
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
                const error = new Error("Error sending message: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }
            console.log("Message sent:", result);
            queryClient.invalidateQueries({ queryKey: ['messages', newMessage.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
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
                const error = new Error("Error editing message: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }
            console.log("Message edited:", result);
            queryClient.invalidateQueries({ queryKey: ['messages', updatedMessage.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
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
                const error = new Error("Error deleting message: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }
            console.log("Deleted message:", result);
            queryClient.invalidateQueries({ queryKey: ['messages', message.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        },
    });
}
