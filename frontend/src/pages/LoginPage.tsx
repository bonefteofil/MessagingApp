import { useContext, useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Avatar, Button, Group, Radio, Stack, Text } from "@mantine/core";
import { getUsers } from "../queries/usersQueries";
import Loading from "../components/Loading";
import ResponsiveCard from "../components/ResponsiveCard";
import ErrorPage from "../errors/ErrorPage";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import type UserScheme from "../types/userScheme";
import { loginUser } from "../queries/authQueries";
import type { LoginScheme } from "../types/userScheme";

export default function LoginPage() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { data, error } = getUsers();
    const [value, setValue] = useState<UserScheme | null>(null);
    const navigate = useNavigate();
    const loginMutation = loginUser();

    if (currentUser) return <Navigate to="/" replace />;
    if (error) return <ErrorPage message={error.message} />;

    useEffect(() => {
        if (loginMutation.isSuccess) {
            setCurrentUser(loginMutation.data as LoginScheme);
            navigate("/", { replace: true });
        }
    }, [loginMutation.isSuccess]);

    return (
        <Radio.Group value={value?.id!.toString()}>
            <ResponsiveCard title="Login into your account">
                <Stack align="stretch">
                    <Loading loading={!data} />

                    {data && data.map((user: UserScheme) => (
                        <Radio.Card
                            withBorder={false}
                            value={user.id!.toString()}
                            radius='md'
                            key={user.id}
                        >
                            <Group
                                p="sm"
                                classNames={{ root: `rounded-xl cursor-pointer border ${value?.id === user.id ? 'border-gray-200' : 'border-gray-600'}` }}
                                onClick={() => setValue(user)}
                            >
                                <Radio.Indicator />
                                <Avatar />
                                <Text truncate="end">{user.id}, {user.username}</Text>
                            </Group>
                        </Radio.Card>
                    ))}

                    <Group justify="center">
                        <Button
                            radius='md'
                            disabled={!value}
                            loading={loginMutation.isPending}
                            onClick={() => { loginMutation.mutate({ username: value!.username }); }}
                        >
                            Log in
                        </Button>
                        <Text>or</Text>
                        <Button radius='md' variant="outline" onClick={() => { navigate("/register", { replace: true }); }}>
                            Go to register
                        </Button>
                    </Group>
                </Stack>
            </ResponsiveCard>
        </Radio.Group>
    );
}