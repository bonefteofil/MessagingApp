import { useContext, useEffect, useRef } from 'react';
import type MessageScheme from '../types/message';
import { getMessages } from '../queries/messagesQueries';
import Error from '../components/Error';
import Loading from '../components/Loading';
import MessageBubble from '../components/MessageBubble';
import { Stack, Text, Chip } from "@mantine/core";
import { CurrentGroupContext } from '../contexts/CurrentGroupContext';

export default function ChatPage() {
    const { currentGroup } = useContext(CurrentGroupContext);
    const { error, data } = getMessages(currentGroup!.id!);

    if (error)
        return <Error message={"Error loading messages: " + error.message} />;

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
    
    let lastDate: string | null = null;
    return (
        <Stack p='md'>
            <Loading loading={!data} />

            {data && data.map((message: MessageScheme) => {
                const messageDate = new Date(message.createdAt!).toLocaleDateString([], {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                });
                const showSeparator = messageDate !== lastDate;
                lastDate = messageDate;

                return (
                    <Stack key={message.id}>
                        {showSeparator && (
                            <Chip p='xs' mx='auto' w="fit-content" style={{ textAlign: 'center' }}>
                                <Text size='xs'>{messageDate}</Text>
                            </Chip>
                        )}

                        <MessageBubble message={message} />
                    </Stack>
                );
            })}
        </Stack>
    );
}