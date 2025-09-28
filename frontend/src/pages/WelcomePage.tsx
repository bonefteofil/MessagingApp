import { useContext, useState } from "react";
import { Avatar, Button, Group, Radio, Stack, Text } from "@mantine/core";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { getUsers } from "../queries/usersQueries";
import ErrorPage from "./ErrorPage";
import Loading from "../components/Loading";
import type UserScheme from "../types/userScheme";

export default function WelcomePage({setSelectUser}: { setSelectUser: (value: boolean) => void }) {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const { data, error } = getUsers();
    
    const [value, setValue] = useState<UserScheme | null>(currentUser);

    if (error) return <ErrorPage message="Failed to load users" />;

    return (
        <Stack align="stretch" p='xl'>
            <Text size="xl">Welcome to Messaging App!</Text>
            <Loading loading={!data} />

            <Radio.Group value={value?.id!.toString()}>
                <Stack>
                    {data && data.map((user: UserScheme) => (
                        <Radio.Card
                            withBorder={false}
                            value={user.id!.toString()}
                            radius='md'
                            key={user.id}
                        >
                            <Group
                                p="sm"
                                classNames={{ root: `${currentUser?.id === user.id && 'bg-gray-700'} rounded-xl cursor-pointer border ${value?.id === user.id ? 'border-gray-200' : 'border-gray-600'}` }}
                                onClick={() => setValue(user)}
                            >
                                <Radio.Indicator />
                                <Avatar />
                                <Text truncate="end">{user.id}, {user.username}</Text>
                            </Group>
                        </Radio.Card>
                    ))}
                </Stack>
            </Radio.Group>

            <Group>
                <Button disabled={!value} onClick={() => { setCurrentUser(value); setCurrentGroup(null); setSelectUser(false); }}>Log in</Button>
                <Button variant="light" color="red" onClick={() => { setCurrentUser(null); setCurrentGroup(null); setSelectUser(false); }}>Log out</Button>
            </Group>
        </Stack>
    );
}