import { Center, Text, Anchor } from "@mantine/core";

export default function Credits() {
    return (
        <Center p='sm'>
            <Text size="lg" c="dimmed">
                <Anchor href="https://bonefteofil.ro" target="_blank">Bonef Teofil</Anchor>
                {' • 2025 • '}
                <Anchor href="https://github.com/bonefteofil/MessagingApp" target="_blank">GitHub</Anchor>
            </Text>
        </Center>
    );
}