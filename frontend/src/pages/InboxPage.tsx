import { useContext } from "react";
import type GroupScheme from "../types/group";
import { getGroups } from "../queries/groupsQueries";
import ErrorPage from "./ErrorPage";
import Loading from "../components/Loading";
import { Avatar, Divider, Group, Stack, Text, ScrollArea } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import GroupForm from "../components/GroupForm";

export default function InboxPage() {
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const { error, data } = getGroups();
    
    if (error)
        return <ErrorPage message="Failed to load chats" />;

    return (
        <ScrollArea type="scroll" px='sm'>
            <Group p='md'>
                <Text flex={1} size="xl">Welcome user!</Text>
                <GroupForm />
                <Avatar size="md" />
            </Group>

            <Loading loading={!data} />

            {data && data.map((group: GroupScheme) => (
                <div key={group.id}>
                    <Group gap="md" p="xs" align="top"
                        classNames={{ root: 'hover:bg-gray-700 cursor-pointer rounded-lg' }}
                        onClick={() => { setCurrentGroup(group); }}
                    >
                        <Avatar size="lg" />

                        <Stack gap="0" justify="start" className="overflow-hidden h-max flex-1">
                            <Group className="w-full" justify="space-between">
                                <Text size="lg" className="truncate max-w-[60%]"> {group.name} </Text>
                                <Text size="sm" className="ml-auto whitespace-nowrap text-gray-400"> 3 days ago </Text>
                            </Group>

                            <Text size="sm" c="dimmed">Last message </Text>
                        </Stack>
                    </Group>

                    <Divider w={'70%'} mx={'auto'} />
                </div>
            ))}
        </ScrollArea>
    );
}