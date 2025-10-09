import { notifications } from "@mantine/notifications";
import { DEFAULT_THEME } from '@mantine/core';

export function ShowErrorNotification(errorMessage: string) {
    const theme = DEFAULT_THEME;

    notifications.show({
        autoClose: false,
        message: errorMessage,
        color: 'null',
        position: 'top-center',
        radius: 'md',
        styles: {
            root: {
                backgroundColor: theme.colors.red[8],
            },
            description: {
                color: 'white',
                fontWeight: 'bold'
            },
            closeButton: {
                color: theme.white,
                borderRadius: theme.radius.md,
                backgroundColor: 'transparent',
                border: `1px solid white`,
            },
        },
    });
    console.error(errorMessage);
    throw new Error(errorMessage);
}