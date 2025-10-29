import { useQuery } from "@tanstack/react-query";


export function GetStatus() {
    return useQuery({
        queryKey: ["status"],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/status`, { method: "GET" });
                if (!response.ok) throw new Error("Network response was not ok");
                return response;
            } catch (error: any) {
                throw error;
            }
        },
        retry: false,
        refetchInterval: 5000,
    })
}