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
    if (response.status === 401) {
        response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        // If refresh was successful, retry original request
        if (response.status === 200) {
            response = await fetch('/api' + route, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
            });
        } else { 
            window.location.href = '/#/logout';
            return null;
        }
    }
    const result = await response.json();
    if (!response.ok) return ShowErrorNotification(`${errorText}: ${response.status} ${result.title}`);
    cleanNotifications();
    return result;
}