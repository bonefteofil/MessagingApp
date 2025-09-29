import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type GroupScheme from "../types/groupScheme";
import { ShowError } from "../components/ShowError";
import { cleanNotifications } from "@mantine/notifications";
import { formatLastMessageDate, formatFullDate } from "../utils/FormatDate";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const API_URL = import.meta.env.VITE_API_URL;

export function getGroups() {
    const { currentUser } = useContext(CurrentUserContext);

    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            if (!currentUser) return ShowError("You must be logged in to view groups.");

            const response = await fetch(`${API_URL}/groups`, {
                method: "GET",
                headers: { 'userId': currentUser.id!.toString() }
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error getting groups: " + result.title);

            const groupsWithLocalTime = result.map((group: GroupScheme) => ({
                ...group,
                lastMessageAt: formatLastMessageDate(group.lastMessageAt!),
                createdAt: formatFullDate(group.createdAt!)
            }));
            console.log("Fetched groups:", groupsWithLocalTime);
            cleanNotifications();
            return groupsWithLocalTime;
        },
        retry: false,
    });
}

export function createGroup() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newGroup: GroupScheme) => {
            if (!currentUser) return ShowError("You must be logged in to create groups.");

            const response = await fetch(`${API_URL}/groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'userId': currentUser.id!.toString() },
                body: JSON.stringify(newGroup),
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error creating group: " + result.title);

            console.log("Group created:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}

export function editGroup() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedGroup: GroupScheme) => {
            if (!currentUser) return ShowError("You must be logged in to edit groups.");

            const response = await fetch(`${API_URL}/groups/${updatedGroup.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'userId': currentUser.id!.toString() },
                body: JSON.stringify(updatedGroup),
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error updating group: " + result.title);

            console.log("Group updated:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}

export function deleteGroup() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (group: GroupScheme) => {
            if (!currentUser) return ShowError("You must be logged in to delete groups.");

            const response = await fetch(`${API_URL}/groups/${group.id}`, {
                method: 'DELETE',
                headers: { 'userId': currentUser.id!.toString() },
            });
            const result = await response.json();
            if (!response.ok) return ShowError("Error deleting group: " + result.title);

            console.log("Group deleted:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}