import { useEffect, useRef } from 'react';
import type MessageScheme from '../types/message';
import { deleteMessage, getMessages } from '../queries/messagesQueries';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton, Stack, Group, ActionIcon, Paper, Text } from "@mantine/core";
import Error from './Error';

export default function MessagesList({ setEditingMessage, groupId }: { setEditingMessage: (message: MessageScheme | null) => void, groupId: number }) {
    const { error, data } = getMessages(groupId);
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
            {!data && <>
                <Skeleton p={16} height={48} radius='lg' width='70%' />
                <Skeleton p={16} height={48} radius='lg' width='30%' />
                <Skeleton p={16} height={48} radius='lg' width='70%' />
                <Skeleton p={16} height={48} radius='lg' width='30%' />
            </>}


            {data && data.map((message: MessageScheme) => (
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
                            onClick={() => deleteMutation.mutate(message)}
                            loading={deleteMutation.isPending && deleteMutation.variables === message}>
                                <FontAwesomeIcon icon={faTrash} />
                        </ActionIcon>
                    </Group>
                </Group>
            ))}
        </Stack>
    );
}