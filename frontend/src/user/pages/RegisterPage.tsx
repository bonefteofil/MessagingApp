import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Button, Group, Input, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { register } from "@user/api";

import ResponsiveCard from "@components/ResponsiveCard";


export default function RegisterPage() {
    const createMutation = register();
    const [cookies] = useCookies(['userId']);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { username: '' },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({ username: form.values.username });
    }
    if (cookies.userId) return <Navigate to="/" replace />;

    return (
        <ResponsiveCard title="sfsdfs">
            <form autoComplete="off" id="asdasd-form" onSubmit={handleSubmit} >
                <Stack align="stretch">
                    <Input
                        type="text"
                        data-autofocus
                        placeholder="Username"
                        radius='md'
                        size="md"
                        mb='sm'
                        autoComplete="off"
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