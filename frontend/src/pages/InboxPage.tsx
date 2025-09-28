import { useContext } from "react";
import type GroupScheme from "../types/groupScheme";
import { getGroups } from "../queries/groupsQueries";
import ErrorPage from "./ErrorPage";
import Loading from "../components/Loading";
import { Avatar, Divider, Group, Stack, Text, ScrollArea, Switch, Tooltip, Code, Box } from "@mantine/core";
import { DeveloperModeContext } from "../contexts/DeveloperModeContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { EditingMessageContext } from "../contexts/EditingMessageContext";
import GroupForm from "../components/GroupForm";

export default function InboxPage({ setSelectUser }: { setSelectUser: (value: boolean) => void }) {
    const { developerMode, setDeveloperMode } = useContext(DeveloperModeContext);
    const { currentGroup, setCurrentGroup } = useContext(CurrentGroupContext);
    const { setEditingMessage } = useContext(EditingMessageContext);
    const { data, error } = getGroups();
    
    if (error) {
        setCurrentGroup(null);
        return <ErrorPage message="Failed to load chats" />;
    }

    return (
        <ScrollArea type="scroll" px='sm'>
            <Group p='md'>
                <Text flex={1} size="xl">Welcome user!</Text>

                <Tooltip label="Development Mode"  refProp="rootRef">
                    <Switch size="lg" onLabel="Dev" offLabel="Prod" checked={developerMode} onChange={() => {setDeveloperMode(!developerMode)}}/>
                </Tooltip>

                <GroupForm />
                <Avatar size="md" onClick={() => {setCurrentGroup(null); setSelectUser(true)}} />
            </Group>

            <Loading loading={!data} />

            {data && data.map((group: GroupScheme) => (
                <div key={group.id}>
                    <Group gap="md" p="xs" align="top"
                        classNames={{ root: `${currentGroup?.id === group.id && 'bg-gray-700'} hover:bg-gray-700 cursor-pointer rounded-lg` }}
                        onClick={() => { setEditingMessage(null); setCurrentGroup(group); }}
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
    );
}