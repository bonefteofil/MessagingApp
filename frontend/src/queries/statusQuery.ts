import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function GetStatus() {
    return useQuery({
        queryKey: ["status"],
        queryFn: async () => {
            try {
                const response = await fetch(`${API_URL}/status`, { method: "GET" });
                if (!response.ok) throw new Error("Network response was not ok");
                return response;
            } catch (error: any) {
                throw error;
            }
        },
        retry: false
    })
}