import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type GroupScheme from "../types/groupScheme";
import { ShowError } from "../components/ShowError";
import { cleanNotifications } from "@mantine/notifications";
import { formatLastMessageDate, formatFullDate } from "../utils/FormatDate";

const API_URL = import.meta.env.VITE_API_URL;

export function getGroups() {
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/groups`, {method: "GET"});
            const result = await response.json();

            if (!response.ok) {
                const error = new Error("Error getting groups: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }

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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newGroup: GroupScheme) => {
            const response = await fetch(`${API_URL}/groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGroup),
            });
            const result = await response.json();

            if (!response.ok) {
                const error = new Error("Error creating group: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }
            console.log("Group created:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}

export function editGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedGroup: GroupScheme) => {
            const response = await fetch(`${API_URL}/groups/${updatedGroup.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedGroup),
            });
            const result = await response.json();

            if (!response.ok) {
                const error = new Error("Error updating group: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }
            console.log("Group updated:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}

export function deleteGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (group: GroupScheme) => {
            const response = await fetch(`${API_URL}/groups/${group.id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (!response.ok) {
                const error = new Error("Error deleting group: " + result.title);
                console.log(error.message);
                ShowError(error.message);
                throw error;
            }
            console.log("Group deleted:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return result;
        }
    });
}