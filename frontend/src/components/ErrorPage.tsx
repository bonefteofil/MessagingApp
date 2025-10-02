import { Button, Stack, Text } from "@mantine/core";

export default function ErrorPage({ message }: { message: string }) {
    return (
        <Stack align="center" justify="center" className="h-full">
            <Text size="lg" c="red">{message}</Text>
            <Button mt="md" onClick={() => window.location.reload()}>Reload</Button>
        </Stack>
    );
}