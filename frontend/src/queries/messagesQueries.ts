import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function getMessages() {
    
    return useQuery({
        queryKey: ["messages"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/messages`, {method: "GET"});
            const result = await response.json();

            if (!response.ok) {
                console.log("Error getting messages:", result.title);
                throw new Error(result.title);
            }
            console.log("Fetched messages:", result);
            return result;
        }
    });
}

export function sendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newMessage: { text: string }) => {
            const response = await fetch(`${API_URL}/messages`, {
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
        mutationFn: async (updatedMessage: { id: number; text: string }) => {
            const response = await fetch(`${API_URL}/messages/${updatedMessage.id}`, {
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
        mutationFn: async (id: number) => {
            const response = await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
            const result = await response.json();
            
            if (!response.ok) {
                console.log("Error deleting message:", result.title);
                throw new Error(result.title);
            }
            console.log("Deleted message:", result);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            return id;
        },
    });
}
