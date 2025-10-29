import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Group, Input, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { register } from "@user/api";

import CurrentUserContext from "@user/Context";

import ResponsiveCard from "@components/ResponsiveCard";

import type { LoginScheme } from "@user/schema";


export default function RegisterPage() {
    const navigate = useNavigate();
    const createMutation = register();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    const form = useForm({
        initialValues: { username: '' },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({ username: form.values.username });
    }

    useEffect(() => {
        if (currentUser) {
            navigate("/", { replace: true });
        }
    }, [currentUser]);

    useEffect(() => {
        if (createMutation.isSuccess) {
            form.reset();
            setCurrentUser(createMutation.data as LoginScheme);
            navigate("/", { replace: true });
        }
    }, [createMutation.isSuccess]);

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