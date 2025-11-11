import { useContext } from 'react';
import { useCookies } from 'react-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Group, ActionIcon, Text, Card, Code } from "@mantine/core"

import { deleteMessage } from '@messages/api';

import EditingMessageContext from '@messages/Context';
import DeveloperModeContext from '@components/DeveloperModeContext';

import type MessageScheme from '@messages/schema';


export default function MessageBubble({ message } : { message: MessageScheme }) {
    const { developerMode } = useContext(DeveloperModeContext);
    const { setEditingMessage } = useContext(EditingMessageContext);
    const [cookies] = useCookies(['userId']);

    const isOwnMessage = message.userId == cookies.userId;
    const deleteMutation = deleteMessage();

    return (
        <Group justify='space-between'>
            {isOwnMessage &&
                <Group gap='sm'>
                    <ActionIcon
                        variant="light"
                        size='xl'
                        radius='md'
                        onClick={() => {console.log("Editing message:", message); setEditingMessage(message)}}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        size='xl'
                        radius='md'
                        color="red"
                        onClick={() => {console.log("Deleting message:", message); deleteMutation.mutate({text: message.text, id: message.id, groupId: message.groupId})}}
                        loading={deleteMutation.isPending && deleteMutation.variables.id === message.id}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </ActionIcon>
                </Group>
            }

            <Card
                padding='xs'
                shadow="xl"
                radius="md"
                className={`wrap-anywhere max-w-3/5 bg-gradient-to-tr ${
                    isOwnMessage 
                        ? "from-violet-600 to-violet-700"
                        : "from-blue-600 to-cyan-700"
                }`}
            >
                {!isOwnMessage && <Text size="xs">{message.username}</Text>}

                <Text>{message.text || "NULL"}</Text>

                <Group gap='xs' justify='end'>
                    {message.edited && <Text size="xs">Edited</Text>}
                    <Text size="xs">{message.createdTime!}</Text>
                </Group>

                {developerMode && <Code block>{JSON.stringify(message, null, 2)}</Code>}
            </Card>
        </Group>
    );
}