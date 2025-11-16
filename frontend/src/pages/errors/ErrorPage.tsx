import { Button, Text } from "@mantine/core";

import ResponsiveCard from "@components/ResponsiveCard";


export default function ErrorPage({ message }: { message: string }) {

    return (
        <ResponsiveCard title="An Error Occurred">
            <Text size="lg" c="red">{message}</Text>
            <Button mt="md" radius="md" onClick={() => window.location.reload()}>Reload</Button>
        </ResponsiveCard>
    );
}