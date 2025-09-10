import { useEffect, useRef } from 'react';
import type MessageScheme from '../types/message';
import { getMessages } from '../queries/messagesQueries';
import Error from '../components/Error';
import type GroupScheme from '../types/group';
import Loading from '../components/Loading';
import MessageBubble from '../components/MessageBubble';
import { Stack } from "@mantine/core";

interface MessagesListProps {
    setEditingMessage: (message: MessageScheme | null) => void;
    currentGroup: GroupScheme;
}

export default function ChatPage({ setEditingMessage, currentGroup } : MessagesListProps) {
    const { error, data } = getMessages(currentGroup.id!);

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
        return <Error message={"Error loading messages: " + error.message} />;
    
    return (
        <Stack p='md'>
            <Loading loading={!data} />

            {data && data.map((message: MessageScheme) => (
                <MessageBubble key={message.id} message={message} setEditingMessage={setEditingMessage} />
            ))}
        </Stack>
    );
}