import { useEffect, useRef } from 'react';
import type MessageScheme from '../types/message';
import { deleteMessage, getMessages } from '../queries/messagesQueries';
import { faTrash, faPenToSquare, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stack, Group, ActionIcon, Text, Box, Affix, Button, Card } from "@mantine/core";
import Error from './Error';
import SendMessage from './SendMessage';
import type GroupScheme from '../types/group';
import Loading from './Loading';

interface MessagesListProps {
    editingMessage: MessageScheme | null;
    setEditingMessage: (message: MessageScheme | null) => void;
    currentGroup: GroupScheme;
    removeGroup: () => void;
}

export default function ChatPage({ editingMessage, setEditingMessage, currentGroup, removeGroup } : MessagesListProps) {
    const { error, data } = getMessages(currentGroup.id!);
    const deleteMutation = deleteMessage();

    // Instantly scroll to the bottom on first load, then use smooth scrolling on updates
    const firstLoad = useRef(true);
    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: firstLoad.current ? 'auto' : 'smooth'
        });
        if (data)
            firstLoad.current = false;
    }, [data]);
    
    if (error)
        return <Error message={"Error loading messages: " + error?.message} />;
    
    return (
        <Stack p='md'>
            <Affix position={{ top: 0, left: 0, right: 0 }} zIndex={50} className="backdrop-blur-lg bg-gray-700/30 px-4 py-2">
                <Group>
                    <Button p='sm' variant="subtle" onClick={removeGroup}> <FontAwesomeIcon icon={faAngleLeft} /> Back </Button>

                    <Text size="xl" className="">
                        {currentGroup ? `${currentGroup.name} (ID: ${currentGroup.id})` : "None selected"}
                    </Text>
                </Group>
            </Affix>

            {/* Spacer */}
			<Box h={40} />

            <Loading loading={!data} />

            {data && data.map((message: MessageScheme) => (
                <Group key={message.id} justify='space-between'>
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
                            onClick={() => setEditingMessage(message)}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                        </ActionIcon>
                        <ActionIcon
                            variant="outline"
                            size='xl'
                            radius='md'
                            color="red"
                            onClick={() => deleteMutation.mutate(message)}
                            loading={deleteMutation.isPending && deleteMutation.variables === message}>
                                <FontAwesomeIcon icon={faTrash} />
                        </ActionIcon>
                    </Group>
                </Group>
            ))}

            {/* Spacer */}
			<Box h={70} />
            
            <SendMessage
                groupId={currentGroup.id!}
                editingMessage={editingMessage}
                clearEditingMessage={() => setEditingMessage(null)}
            />
        </Stack>
    );
}