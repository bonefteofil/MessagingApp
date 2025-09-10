import { Avatar, Stack, Text } from "@mantine/core";

export default function WellcomePage() {
    return (
        <Stack align="center">
            <Avatar size={100} className="mx-auto mt-20" />
            <Text size="xl">Welcome user!</Text>
            <Text size="xl" mt="md">Select a conversation to start chatting</Text>
        </Stack>
    );
}