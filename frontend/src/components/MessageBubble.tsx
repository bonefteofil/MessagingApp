import type MessageScheme from '../types/message';
import { deleteMessage } from '../queries/messagesQueries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Group, ActionIcon, Text, Card } from "@mantine/core"

interface MessageBubbleProps {
    message: MessageScheme;
    setEditingMessage: (message: MessageScheme | null) => void;
}

export default function MessageBubble({ message, setEditingMessage } : MessageBubbleProps) {
    const deleteMutation = deleteMessage();

    return (
        <Group justify='space-between'>
            <Card
                shadow="xl"
                radius="md"
                className="wrap-anywhere max-w-3/5 bg-gradient-to-tr from-blue-600 to-cyan-700"
            >
                <Text>{message.id}, {message.text || "NULL"}</Text>
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