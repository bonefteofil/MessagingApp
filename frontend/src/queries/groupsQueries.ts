import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type GroupScheme from "../types/group";

const API_URL = import.meta.env.VITE_API_URL;

export function getGroups() {
    
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/groups`, {method: "GET"});
            const result = await response.json();

            if (!response.ok) {
                console.log("Error getting groups:", result.title);
                throw new Error(result.title);
            }
            console.log("Fetched groups:", result);
            return result;
        }
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
                console.log("Error creating group:", result.title);
                throw new Error(result.title);
            }
            console.log("Group created:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
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
                console.log("Error updating group:", result.title);
                throw new Error(result.title);
            }
            console.log("Group updated:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
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
                console.log("Error deleting group:", result.title);
                throw new Error(result.title);
            }
            console.log("Group deleted:", result);
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            return result;
        }
    });
}