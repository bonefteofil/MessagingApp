import { cleanNotifications } from "@mantine/notifications";
import { ShowErrorNotification } from "../utils/showErrorNotification";

export async function authFetch({method, route, errorText, body} : {method: string, route: string, errorText: string, body?: any}) {

    const response = await fetch('/api' + route, {
        method: method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (response.status === 401) {
        console.log("authFetch: ");
        window.location.href = '/#/logout';
        return;
    }
    const result = await response.json();
    if (!response.ok) return ShowErrorNotification(`${errorText}: ${response.status} ${result.title}`);
    cleanNotifications();
    return result;
}