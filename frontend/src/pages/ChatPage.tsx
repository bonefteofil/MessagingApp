import { useContext, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import type MessageScheme from '../types/messageScheme';
import { getMessages } from '../queries/messagesQueries';
import ErrorPage from '../components/ErrorPage';
import Loading from '../components/Loading';
import MessageBubble from '../components/MessageBubble';
import { Stack, Text, Badge, Card, AppShell } from "@mantine/core";
import { CurrentGroupContext } from '../contexts/CurrentGroupContext';
import SendMessage from '../components/SendMessage';
import Header from '../components/Header';

export default function ChatPage() {
    const { currentGroup } = useContext(CurrentGroupContext);
    const { error, data, isLoading } = getMessages();
    const instantScroll = useRef(true);
    let lastDate: string | null = null;

    
    // Instantly scroll to the bottom on first load, then, when adding new messages, use smooth scrolling on updates
    useEffect(() => {
        instantScroll.current = true;
    }, [currentGroup]);
    
    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: instantScroll.current ? 'auto' : 'smooth'
        });
        if (!isLoading)
            instantScroll.current = false;
    }, [(data?.length > 0) ? data[data.length - 1].id : null]);

    
    if (!currentGroup) return <Navigate to="/" replace />;
    if (error) return <ErrorPage message="Failed to load messages" />;
    
    return (<>
        <AppShell.Header p='sm' ml={{ base: 0, md: 400 }} className="!backdrop-blur-lg !bg-gray-700/30" >
            <Header />
        </AppShell.Header>

            <Stack p='md'>
                <Card mx='auto' radius='md' color='gray' mt='md' className='text-center'>
                    <Text size='md' c='dimmed'>
                        The group "{currentGroup!.name}" was created on
                        <br />
                        {currentGroup!.createdAt}
                    </Text>
                </Card>

                <Loading loading={isLoading || !data} />

                {data && !isLoading && data.map((message: MessageScheme) => {
                    const messageDate = message.createdAt!;
                    const showSeparator = messageDate !== lastDate;
                    lastDate = messageDate;
                    
                    return (
                        <Stack key={message.id}>
                            {showSeparator && (
                                <Badge mx='auto' color='gray'>
                                    <Text size='xs' c='dimmed'>{messageDate}</Text>
                                </Badge>
                            )}

                            <MessageBubble message={message} />
                        </Stack>
                    );
                })}
            </Stack>

            <SendMessage />
    </>);
}