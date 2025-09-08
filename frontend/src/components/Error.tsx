import { Center, Paper, Text } from "@mantine/core";

export default function Error({ message }: { message: string }) {
    return (
        <Center>
            <Paper bg='red.9' shadow="md" radius='md' p='lg' m='lg'>
                <Text > {message || "Unknown error"} </Text>
            </Paper>
        </Center>
    );
}