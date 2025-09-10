import { useContext, useEffect, useRef } from 'react';
import type MessageScheme from '../types/message';
import { getMessages } from '../queries/messagesQueries';
import Error from '../components/Error';
import Loading from '../components/Loading';
import MessageBubble from '../components/MessageBubble';
import { Stack } from "@mantine/core";
import { CurrentGroupContext } from '../contexts/CurrentGroupContext';

export default function ChatPage() {
    const { currentGroup } = useContext(CurrentGroupContext);
    const { error, data } = getMessages(currentGroup!.id!);

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
                <MessageBubble key={message.id} message={message} />
            ))}
        </Stack>
    );
}