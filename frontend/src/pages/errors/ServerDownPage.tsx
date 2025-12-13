import { Button, Text } from "@mantine/core";

import ResponsiveCard from "@components/ResponsiveCard";


export default function ServerDownPage() {
    return (
        <ResponsiveCard title="503 - Server Down :(">
            <Text>The server is currently unreachable. Please try again later.</Text>
            <Button mt="md" radius="md" onClick={() => window.location.reload()}>Reload</Button>
        </ResponsiveCard>
    );
}