import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Avatar, Divider, Group, Stack, Text } from "@mantine/core";

import EditingMessageContext from "@messages/components/EditingMessageContext";

import type { InboxGroupScheme } from "@schema/groups";


export default function InboxComponent({ group } : { group: InboxGroupScheme }) {
    const { setEditingMessage } = useContext(EditingMessageContext);
    const navigate = useNavigate();
    const params = useParams();
    const groupId = params.groupId;

    return (<>
        <Group gap="md" p="xs" align="top"
            classNames={{ root: `${groupId == group.id && 'bg-gray-700'} hover:bg-gray-700 cursor-pointer rounded-lg` }}
            onClick={() => {
                setEditingMessage(null);
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

        <Divider w={'70%'} mx={'auto'} />
    </>);
}