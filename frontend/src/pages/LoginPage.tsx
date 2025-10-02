import { useContext, useState } from "react";
import { Avatar, Button, Card, Group, Radio, Stack, Text } from "@mantine/core";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { getUsers } from "../queries/usersQueries";
import ErrorPage from "../components/ErrorPage";
import Loading from "../components/Loading";
import type UserScheme from "../types/userScheme";
import { useNavigate, Navigate } from "react-router-dom";

export default function WelcomePage() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const { data, error } = getUsers();
    const [value, setValue] = useState<UserScheme | null>(null);
    const navigate = useNavigate();

    if (currentUser) return <Navigate to="/" replace />;
    if (error) return <ErrorPage message="Failed to load users" />;

    return (
        <Radio.Group value={value?.id!.toString()}>
            <Card withBorder shadow="sm" p='xl' mx='auto' my='xl' radius='lg' style={{ maxWidth: 600 }}>
                <Stack align="center">
                    <Text size="xl">Login into your account</Text>
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

                    <Group>
                        <Button radius='md' disabled={!value} onClick={() => { setCurrentUser(value); setCurrentGroup(null); navigate("/", { replace: true }); }}>Log in</Button>
                    </Group>
                </Stack>
            </Card>
        </Radio.Group>
    );
}