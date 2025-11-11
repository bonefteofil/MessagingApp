import { useQuery } from "@tanstack/react-query";


export function FetchServerStatus() {
    return useQuery({
        queryKey: ["serverStatus"],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/status`, { method: "GET" });
                if (!response.ok) throw new Error("Network response was not ok");
                return response.status;
            } catch (error: any) {
                throw error;
            }
        },
        retry: false,
        refetchInterval: 5000,
    })
}