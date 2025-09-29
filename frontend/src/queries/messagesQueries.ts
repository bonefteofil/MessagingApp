import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type MessageScheme from "../types/messageScheme";
import { ShowError } from "../components/ShowError";
import { cleanNotifications } from "@mantine/notifications";
import { formatFullDate, formatMessageTime } from "../utils/FormatDate";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const API_URL = import.meta.env.VITE_API_URL;

export function getMessages(groupId: number) {
    const { currentUser } = useContext(CurrentUserContext);
    return useQuery({
        queryKey: ["messages", groupId],
        queryFn: async () => {
            if (!currentUser) return ShowError("You must be logged in to view messages.");

            const response = await fetch(`${API_URL}/groups/${groupId}/messages`, {
                method: "GET",
                headers: { 'userId': currentUser.id!.toString() }
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error getting messages: " + result.title);

            const messagesWithLocalTime = result.map((message: MessageScheme) => ({
                ...message, 
                createdAt: formatFullDate(message.createdAt!),
                createdTime: formatMessageTime(message.createdAt!)
            }));
            console.log("Fetched messages:", messagesWithLocalTime);
            cleanNotifications();
            return messagesWithLocalTime;
        },
        retry: false,
    });
}

export function sendMessage() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newMessage: MessageScheme) => {
            if (!currentUser) return ShowError("You must be logged in to send messages.");

            const response = await fetch(`${API_URL}/groups/${newMessage.groupId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'userId': currentUser.id!.toString() },
                body: JSON.stringify(newMessage),
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error sending message: " + result.title);

            console.log("Message sent:", result);
            queryClient.invalidateQueries({ queryKey: ['messages', newMessage.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}

export function editMessage() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedMessage: MessageScheme) => {
            if (!currentUser) return ShowError("You must be logged in to edit messages.");

            const response = await fetch(`${API_URL}/groups/${updatedMessage.groupId}/messages/${updatedMessage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'userId': currentUser.id!.toString() },
                body: JSON.stringify(updatedMessage),
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error editing message: " + result.title);

            console.log("Message edited:", result);
            queryClient.invalidateQueries({ queryKey: ['messages', updatedMessage.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}

export function deleteMessage() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message: MessageScheme) => {
            if (!currentUser) return ShowError("You must be logged in to delete messages.");

            const response = await fetch(`${API_URL}/groups/${message.groupId}/messages/${message.id}`, {
                method: 'DELETE',
                headers: { 'userId': currentUser.id!.toString() }
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error deleting message: " + result.title);

            console.log("Deleted message:", result);
            queryClient.invalidateQueries({ queryKey: ['messages', message.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        },
    });
}
