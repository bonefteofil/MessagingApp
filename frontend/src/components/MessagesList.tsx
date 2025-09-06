import { useEffect, useRef } from 'react';
import type Message from '../models/message';
import { deleteMessage, getMessages } from '../queries/messagesQueries';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton, Stack, Group, ActionIcon, Paper, Text, Center } from "@mantine/core";

export default function MessagesList({ setEditingMessage }: { setEditingMessage: (message: Message | null) => void }) {
    const { isPending, error, data } = getMessages();
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

    return (
        <Stack p='md'>
            {(isPending || !data || error) && <>
                <Skeleton p={16} height={48} radius='lg' width='70%' />
                <Skeleton p={16} height={48} radius='lg' width='30%' />
                <Skeleton p={16} height={48} radius='lg' width='70%' />
                <Skeleton p={16} height={48} radius='lg' width='30%' />
            </>}

            {error && (
                <Center>
                    <Paper bg='red.9' shadow="md" radius='md'>
                        <Text p='sm'> Error loading messages: {error?.message || "Unknown error"} </Text>
                    </Paper>
                </Center>
            )}

            {data && data.map((message: Message) => (
                <Group key={message.id} justify='space-between'>
                    <Paper shadow="md" radius='md' p='sm' bg='green.9' className='wrap-anywhere max-w-3/5'>
                        <Text>{message.id}, {message.text || "NULL"}</Text>
                    </Paper>
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
                            onClick={() => deleteMutation.mutate(message.id!)}
                            loading={deleteMutation.isPending && deleteMutation.variables === message.id}>
                                <FontAwesomeIcon icon={faTrash} />
                        </ActionIcon>
                    </Group>
                </Group>
            ))}
        </Stack>
    );
}