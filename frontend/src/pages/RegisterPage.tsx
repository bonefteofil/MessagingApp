import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Group, Input, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createUser } from "../queries/usersQueries";
import ResponsiveCard from "../components/ResponsiveCard";

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
        <ResponsiveCard title="Create new account">
            <form onSubmit={handleSubmit} >
                <Stack align="stretch">
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
                        <Button radius='md' type="submit" disabled={!form.getValues().username} loading={createMutation.isPending}>
                            Register
                        </Button>
                        <Text>or</Text>
                        <Button disabled={createMutation.isPending} variant="outline" radius='md' onClick={() => { navigate("/login", { replace: true }); }}>
                            Go to login
                        </Button>
                    </Group>
                </Stack>
            </form>
        </ResponsiveCard>
    )
}