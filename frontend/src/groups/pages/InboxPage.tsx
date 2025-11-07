import { useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Divider, Group, Stack, Text, ScrollArea, Code, Box, AppShell, ActionIcon } from "@mantine/core";

import { getGroups } from "@groups/api";

import CurrentGroupContext from "@groups/Context";
import EditingMessageContext from "@messages/Context";
import DeveloperModeContext from "@components/DeveloperModeContext";

import GroupForm from "@groups/components/GroupForm";
import Loading from "@components/Loading";
import ErrorPage from "@errors/ErrorPage";

import type GroupScheme from "@groups/schema";


export default function InboxPage() {
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const { setEditingMessage } = useContext(EditingMessageContext);
    const { developerMode } = useContext(DeveloperModeContext);
    const [cookies] = useCookies(['userId']);

    const { data, error, isLoading } = getGroups();
    const { groupId } = useParams();
    const navigate = useNavigate();

    if (!cookies.userId) return <Navigate to="/login" replace />;
    if (error) return (<AppShell.Navbar withBorder><ErrorPage message={error.message} /></AppShell.Navbar>);

    return (
        <AppShell.Navbar withBorder>
            <ScrollArea type="scroll" px='sm'>
                <Group p='md'>
                    <Text flex={1} size="xl" variant="gradient" fw={700}>Chats</Text>
                    <GroupForm />
                    <ActionIcon
                        p="md"
                        variant="light"
                        radius='xl'
                        onClick={() => { navigate("/account"); }}
                    >
                        <FontAwesomeIcon icon={faUser} />
                    </ActionIcon>
                </Group>

                <Loading loading={isLoading} />

                {data && data.map((group: GroupScheme) => (
                    <div key={group.id}>
                        <Group gap="md" p="xs" align="top"
                            classNames={{ root: `${groupId == group.id && 'bg-gray-700'} hover:bg-gray-700 cursor-pointer rounded-lg` }}
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
    );
}