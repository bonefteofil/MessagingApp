import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Alert, Button, Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { loginUser } from "@api/auth";

import Header from "@components/Header";
import ResponsiveCard from "@components/ResponsiveCard";


export default function LoginPage() {
    const loginMutation = loginUser();
    const [cookies] = useCookies(['userId']);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { username: '', password: '' },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({
            username: form.values.username,
            password: form.values.password
        });
    }
    if (cookies.userId) return <Navigate to="/" replace />;

    return (
        <Stack>
            <Header element={
                <Text ml="md" size="xl" truncate="end">Login</Text>
            } />
            <ResponsiveCard title="Login into your account">
                <form autoComplete="true" id="login-form" onSubmit={handleSubmit} >
                    <Stack align="stretch">
                        {loginMutation.error && <Alert variant="light" color="red" radius="md">
                            <Text size="sm">
                                {(loginMutation.error as Error).message}
                            </Text>
                        </Alert>}

                        <TextInput
                            type="text"
                            autoFocus
                            radius='md'
                            size="md"
                            mb='sm'
                            label="Username"
                            placeholder="Enter your username"
                            autoComplete="username"
                            {...form.getInputProps('username')}
                        />
                        <PasswordInput
                            radius='md'
                            size="md"
                            mb='sm'
                            label="Password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            {...form.getInputProps('password')}
                        />

                        <Group justify="center">
                            <Button
                                type="submit"
                                radius='md'
                                loading={loginMutation.isPending}
                                disabled={!form.getValues().username || !form.getValues().password}
                            >
                                Log in
                            </Button>

                            <Text>or</Text>

                            <Button
                                radius='md'
                                variant="outline"
                                onClick={() => { navigate("/register", { replace: true }); }}
                            >
                                Go to register
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </ResponsiveCard>
        </Stack>
    );
}