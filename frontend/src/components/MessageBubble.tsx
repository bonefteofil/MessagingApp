import { useContext } from 'react';
import type MessageScheme from '../types/messageScheme';
import { deleteMessage } from '../queries/messagesQueries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Group, ActionIcon, Text, Card, Code } from "@mantine/core"
import { EditingMessageContext } from '../contexts/EditingMessageContext';
import { DeveloperModeContext } from '../contexts/DeveloperModeContext';

export default function MessageBubble({ message } : { message: MessageScheme }) {
    const { developerMode } = useContext(DeveloperModeContext);
    const { setEditingMessage } = useContext(EditingMessageContext);
    const deleteMutation = deleteMessage();

    return (
        <Group justify='space-between'>
            <Card
                padding='xs'
                shadow="xl"
                radius="md"
                className="wrap-anywhere max-w-3/5 bg-gradient-to-tr from-blue-600 to-cyan-700"
            >
                {message.username && <Text size="xs">{message.username}</Text>}

                <Text>{message.text || "NULL"}</Text>

                <Group gap='xs' justify='end'>
                    {message.edited && <Text size="xs">Edited</Text>}
                    <Text size="xs">{message.createdTime!}</Text>
                </Group>

                {developerMode && <Code block>{JSON.stringify(message, null, 2)}</Code>}
            </Card>

            {developerMode && <Group gap='sm'>
                <ActionIcon
                    variant="light"
                    size='xl'
                    radius='md'
                    onClick={() => setEditingMessage(message)}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </ActionIcon>
                <ActionIcon
                    variant="light"
                    size='xl'
                    radius='md'
                    color="red"
                    onClick={() => deleteMutation.mutate(message)}
                    loading={deleteMutation.isPending && deleteMutation.variables === message}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </ActionIcon>
            </Group>}
        </Group>
    );
}