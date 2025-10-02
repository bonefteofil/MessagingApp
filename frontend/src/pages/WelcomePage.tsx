import { Card, Text } from "@mantine/core";

export default function WelcomePage() {

    return (
        <Card p='xl' radius='lg' maw={600} mx='auto' my='xl'>
            <Text ta="center" size="xl">Welcome to Messaging App!</Text>
        </Card>
    );
}