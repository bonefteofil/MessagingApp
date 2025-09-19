import { useContext } from 'react';
import type MessageScheme from '../types/messageScheme';
import { deleteMessage } from '../queries/messagesQueries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Group, ActionIcon, Text, Card } from "@mantine/core"
import { EditingMessageContext } from '../contexts/EditingMessageContext';

export default function MessageBubble({ message } : { message: MessageScheme }) {
    const { setEditingMessage } = useContext(EditingMessageContext);
    const deleteMutation = deleteMessage();

    return (
        <Group justify='space-between'>
            <Card
                shadow="xl"
                radius="md"
                className="wrap-anywhere max-w-3/5 bg-gradient-to-tr from-blue-600 to-cyan-700"
            >
                <Text>{message.id}, {message.text || "NULL"}</Text>
                <Group gap='xs' justify='end'>
                    {message.edited && <Text size="xs">Edited</Text>}
                    <Text size="xs">
                        {message.createdTime!}
                    </Text>
                </Group>
            </Card>

            <Group gap='sm'>
                <ActionIcon
                    variant="outline"
                    size='xl'
                    radius='md'
                    onClick={() => setEditingMessage(message)}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </ActionIcon>
                <ActionIcon
                    variant="outline"
                    size='xl'
                    radius='md'
                    color="red"
                    onClick={() => deleteMutation.mutate(message)}
                    loading={deleteMutation.isPending && deleteMutation.variables === message}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </ActionIcon>
            </Group>
        </Group>
    );
}