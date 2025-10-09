import { useContext } from "react";
import { cleanNotifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShowErrorNotification } from "../errors/ShowErrorNotification";
import { transformMessageDate } from "../utils/FormatDate";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import type MessageScheme from "../types/messageScheme";

const API_URL = import.meta.env.VITE_API_URL;

export function getMessages() {
    const { currentUser } = useContext(CurrentUserContext);
    const { currentGroup } = useContext(CurrentGroupContext);

    return useQuery({
        queryKey: ["messages", currentGroup?.id],
        queryFn: async () => {

            const response = await fetch(`${API_URL}/groups/${currentGroup!.id}/messages`, {
                method: "GET",
                headers: { 'userId': currentUser!.id!.toString() }
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification("Error getting messages: " + result.title);

            const messagesWithLocalTime = result.map((message: MessageScheme) => transformMessageDate(message));
            console.log("Fetched messages:", messagesWithLocalTime);
            cleanNotifications();
            return messagesWithLocalTime;
        },
        retry: false,
        enabled: !!currentUser && !!currentGroup,
    });
}

export function sendMessage() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newMessage: MessageScheme) => {
            if (!currentUser) return ShowErrorNotification("You must be logged in to send messages.");

            const response = await fetch(`${API_URL}/groups/${newMessage.groupId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'userId': currentUser.id!.toString() },
                body: JSON.stringify(newMessage),
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification("Error sending message: " + result.title);

            console.log("Message sent:", transformMessageDate(result));
            queryClient.invalidateQueries({ queryKey: ['messages', newMessage.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return transformMessageDate(result);
        }
    });
}

export function editMessage() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedMessage: MessageScheme) => {
            if (!currentUser) return ShowErrorNotification("You must be logged in to edit messages.");

            const response = await fetch(`${API_URL}/groups/${updatedMessage.groupId}/messages/${updatedMessage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'userId': currentUser.id!.toString() },
                body: JSON.stringify(updatedMessage),
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification("Error editing message: " + result.title);

            console.log("Message edited:", transformMessageDate(result));
            queryClient.invalidateQueries({ queryKey: ['messages', updatedMessage.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return transformMessageDate(result);
        }
    });
}

export function deleteMessage() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message: MessageScheme) => {
            if (!currentUser) return ShowErrorNotification("You must be logged in to delete messages.");

            const response = await fetch(`${API_URL}/groups/${message.groupId}/messages/${message.id}`, {
                method: 'DELETE',
                headers: { 'userId': currentUser.id!.toString() }
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification("Error deleting message: " + result.title);

            console.log("Deleted message:", transformMessageDate(result));
            queryClient.invalidateQueries({ queryKey: ['messages', message.groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return transformMessageDate(result);
        },
    });
}
