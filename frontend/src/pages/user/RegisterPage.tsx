import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Button, Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { register } from "@api/auth";

import ResponsiveCard from "@components/ResponsiveCard";
import Header from "@components/Header";


export default function RegisterPage() {
    const createMutation = register();
    const [cookies] = useCookies(['userId']);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { username: '', password: '' },
        validateInputOnBlur: true,
        validate: {
            username: (value) => {
                if (value.length < 4) return 'Username must have at least 4 characters'; 
                if (value.length > 20) return 'Username must have at most 20 characters';
            },
            password: (value) => {
                if (value.length < 4) return 'Password must have at least 4 characters';
                if (value.length > 20) return 'Password must have at most 20 characters';
            }
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createMutation.mutate({
            username: form.values.username,
            password: form.values.password
        });
    }
    if (cookies.userId) return <Navigate to="/" replace />;

    return (
        <Stack>
            <Header element={
                <Text ml="md" size="xl" truncate="end">Register</Text>
            } />
            <ResponsiveCard title="Register a new account">
                <form id="register-form" onSubmit={handleSubmit} >
                    <Stack align="stretch">

                        <TextInput
                            type="text"
                            autoFocus
                            data-autofocus
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
                            autoComplete="new-password"
                            {...form.getInputProps('password')}
                        />

                        <Group justify="center">
                            <Button
                                type="submit"
                                radius='md'
                                loading={createMutation.isPending}
                                disabled={!form.getValues().username || !!form.errors.username || !form.getValues().password || !!form.errors.password}
                            >
                                Register
                            </Button>

                            <Text c="dimmed">or</Text>

                            <Button
                                disabled={createMutation.isPending}
                                variant="outline"
                                radius='md'
                                onClick={() => { navigate("/login", { replace: true }); }}
                            >
                                Go to login
                            </Button>
                        </Group>
                    </Stack>
                </form>

                <Text c="yellow" size="sm" ta="center" mt="sm">
                    Username or password cannot be changed later!
                </Text>
            </ResponsiveCard>
        </Stack>
    )
}