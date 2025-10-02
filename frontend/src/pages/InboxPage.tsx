import { useContext } from "react";
import type GroupScheme from "../types/groupScheme";
import { getGroups } from "../queries/groupsQueries";
import ErrorPage from "../components/ErrorPage";
import Loading from "../components/Loading";
import { Avatar, Divider, Group, Stack, Text, ScrollArea, Code, Box, AppShell, ActionIcon } from "@mantine/core";
import { DeveloperModeContext } from "../contexts/DeveloperModeContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { EditingMessageContext } from "../contexts/EditingMessageContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import GroupForm from "../components/GroupForm";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InboxPage() {
    const { developerMode } = useContext(DeveloperModeContext);
    const { currentGroup, setCurrentGroup } = useContext(CurrentGroupContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { setEditingMessage } = useContext(EditingMessageContext);
    const { data, error } = getGroups();
    const navigate = useNavigate();

    if (!currentUser) return <Navigate to="/login" replace />;

    if (error) {
        return <ErrorPage message="Failed to load chats" />;
    }

    return (<>
        <AppShell.Navbar>
            <ScrollArea type="scroll" px='sm'>
                <Group p='md'>
                    <Text flex={1} size="xl">Chats</Text>
                    <GroupForm />
                    <ActionIcon
                        p="md"
                        variant="light"
                        radius='xl'
                        onClick={() => { navigate("/settings"); }}
                    >
                        <FontAwesomeIcon icon={faGear} />
                    </ActionIcon>
                </Group>

                <Loading loading={!data} />

                {data && data.map((group: GroupScheme) => (
                    <div key={group.id}>
                        <Group gap="md" p="xs" align="top"
                            classNames={{ root: `${currentGroup === group && 'bg-gray-700'} hover:bg-gray-700 cursor-pointer rounded-lg` }}
                            onClick={() => {
                                setEditingMessage(null);
                                setCurrentGroup(group);
                                navigate(`/groups/${group.id}`);
                            }}
                        >
                            <Avatar size="lg" />

                            <Stack gap="0" justify="start" className="overflow-hidden h-max flex-1">
                                <Group className="w-full" justify="space-between" wrap="nowrap">
                                    <Text size='lg' truncate="end">
                                        {group.name}
                                    </Text>
                                    <Text size="sm">
                                        {group.lastMessageAt!}
                                    </Text>
                                </Group>

                                <Text size="sm" c="dimmed" truncate="end">
                                    {group.lastMessage === "" ? "Message null" : (group.lastMessage == null ? "No messages yet" : group.lastMessage)}
                                </Text>
                            </Stack>
                        </Group>
                        
                        {developerMode && <Code block>{JSON.stringify(group, null, 2)}</Code>}

                        <Divider w={'70%'} mx={'auto'} />
                    </div>
                ))}
                <Box h='md' />
            </ScrollArea>
        </AppShell.Navbar>

        <AppShell.Main py={80}>
            <Outlet />
        </AppShell.Main>
    </>);
}