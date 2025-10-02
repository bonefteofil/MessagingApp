import { useNavigate } from "react-router-dom";
import { Button, Card, Group, Input, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createUser } from "../queries/usersQueries";
import { useEffect } from "react";

export default function RegisterPage() {
    const navigate = useNavigate();
    const createMutation = createUser();

    const form = useForm({
        initialValues: { username: '' },
    });

    useEffect(() => {
        if (createMutation.isSuccess) {
            navigate("/login", { replace: true });
            form.reset();
        }
    }, [createMutation.isSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({ username: form.values.username });
    }

    return (
        <Card withBorder shadow="sm" p='xl' mx='auto' my='xl' radius='lg' maw='600'>
            <form onSubmit={handleSubmit} >
                <Stack align="stretch">
                    <Text size='lg'>Create account</Text>
                    <Input
                        type="text"
                        data-autofocus
                        placeholder="Username"
                        radius='md'
                        size="md"
                        mb='sm'
                        {...form.getInputProps('username')}
                    />
                    <Group justify="center">
                        <Button radius='md' type="submit" loading={createMutation.isPending}>Create new account</Button>
                        <Text>or</Text>
                        <Button disabled={createMutation.isPending} variant="outline" radius='md' onClick={() => { navigate("/login", { replace: true }); }}>Go to login</Button>
                    </Group>
                </Stack>
            </form>
        </Card>
    )
}