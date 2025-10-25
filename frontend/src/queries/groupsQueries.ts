import { useContext } from "react";
import { cleanNotifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShowErrorNotification } from "../errors/ShowErrorNotification";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { transformGroupDate } from "../utils/FormatDate";
import type GroupScheme from "../types/groupScheme";

export function getGroups() {
    const { currentUser } = useContext(CurrentUserContext);

    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {

            const response = await fetch(`/api/groups`, {
                method: "GET",
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification(`Error getting groups: ${response.status} ${result.title}`);

            const groupsWithLocalTime = result.map((group: GroupScheme) => transformGroupDate(group));
            console.log("Fetched groups:", groupsWithLocalTime);
            cleanNotifications();
            return groupsWithLocalTime;
        },
        retry: false,
        enabled: !!currentUser,
    });
}

export function createGroup() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newGroup: GroupScheme) => {
            if (!currentUser) return ShowErrorNotification("You must be logged in to create groups.");

            const response = await fetch(`/api/groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newGroup),
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification(`Error creating group: ${response.status} ${result.title}`);

            console.log("Group created:", transformGroupDate(result));
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return transformGroupDate(result);
        }
    });
}

export function editGroup() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedGroup: GroupScheme) => {
            if (!currentUser) return ShowErrorNotification("You must be logged in to edit groups.");

            const response = await fetch(`/api/groups/${updatedGroup.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedGroup),
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification(`Error updating group: ${response.status} ${result.title}`);

            console.log("Group updated:", transformGroupDate(result));
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return transformGroupDate(result);
        }
    });
}

export function deleteGroup() {
    const { currentUser } = useContext(CurrentUserContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (groupId: number) => {
            if (!currentUser) return ShowErrorNotification("You must be logged in to delete groups.");

            const response = await fetch(`/api/groups/${groupId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) return ShowErrorNotification(`Error deleting group: ${response.status} ${result.title}`);

            console.log("Group deleted:", transformGroupDate(result));
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            cleanNotifications();
            return transformGroupDate(result);
        }
    });
}