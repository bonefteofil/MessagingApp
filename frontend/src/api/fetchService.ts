import { useQuery } from "@tanstack/react-query";

import { cleanNotifications } from "@mantine/notifications";

import { ShowErrorNotification } from "@utils/showErrorNotification";


export async function authFetch({method, route, errorText, body} : {method: string, route: string, errorText: string, body?: any}) {
    var response = await fetch('/api' + route, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
    });

    // if unauthorized, try to refresh token
    if (response.status === 401 && document.cookie.split(';').some(c => c.trim().startsWith('userId='))) {
        response = await refreshToken();
        if (response.status !== 200) {
            window.location.href = '/#/logout';
            return null;
        }
        // If refresh was successful, retry original request
        response = await fetch('/api' + route, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
        });
    }
    // Handle rate limiting
    if (response.status === 429) {
        throw new Error("Request rate limit exceeded. Please wait!");
    }
    const result = await response.json();
    if (!response.ok) {
        return ShowErrorNotification(`${errorText}: ${response.status} ${result.title}`);
    }
    cleanNotifications();
    return result;
}

async function refreshToken() {
    return await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });
}

export function serverStatus() {
    return useQuery({
        queryKey: ["serverStatus"],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/status`, { method: "GET" });
                if (!response.ok && response.status !== 429) throw new Error("Network response was not ok");
                return response.status;
            } catch (error: any) {
                throw error;
            }
        },
        retry: false,
    })
}