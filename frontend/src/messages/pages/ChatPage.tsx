import { useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Stack, Text, Badge, Card, Avatar, Button } from "@mantine/core";

import { getMessages } from '@messages/api';
import { getGroupById } from '@groups/api';

import Header from '@messages/components/Header';
import SendMessage from '@messages/components/SendMessage';
import MessageBubble from '@messages/components/MessageBubble';
import DeveloperModeContext from '@components/DeveloperModeContext';
import Loading from '@components/Loading';
import ErrorPage from '@errors/ErrorPage';

import type MessageScheme from '@messages/schema';


export default function ChatPage() {
    const navigate = useNavigate();
    const params = useParams();
    const { data: groupData } = getGroupById(Number(params.groupId));
    const { data: messages, isLoading, error } = getMessages(params.groupId!);
    const { developerMode } = useContext(DeveloperModeContext);
    const instantScroll = useRef(true);
    
    // Instantly scroll to the bottom on first load, then, when adding new messages, use smooth scrolling on updates
    useEffect(() => {
        instantScroll.current = true;
    }, [groupData]);
    
    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: instantScroll.current ? 'auto' : 'smooth'
        });
        if (!isLoading)
            instantScroll.current = false;
    }, [(messages?.length > 0) ? messages[messages.length - 1].id : null]);

    if (error) return <ErrorPage message={error.message} />;
    
    return (<>
        <Header element={
            <Button variant='transparent' onClick={() => navigate("details")}>
                <>
                <Avatar />
                <Text size="sm" truncate="end">{groupData?.name} {developerMode && ` ID: ${groupData?.id}`}</Text>
                <div style={{ flexGrow: 1 }} />
                </>
            </Button>
        } />

        <Stack p='md'>
            <Card mx='auto' radius='md' color='gray' mt='md' className='text-center'>
                <Text size='md' c='dimmed'>
                    The group "{groupData?.name}" was created on
                    <br />
                    {groupData?.createdAt}
                </Text>
            </Card>

            <Loading loading={isLoading || !messages} />
            {messages && !isLoading && (() => {
                let lastDate: string | null = null;
                
                return messages.map((message: MessageScheme) => {
                    const messageDate = message.createdAt!;
                    const showSeparator = messageDate !== lastDate;
                    lastDate = messageDate;

                    if (showSeparator) return (
                        <Stack key={message.id}>
                            <Badge mx='auto' color='gray'>
                                <Text size='xs' c='dimmed'>{messageDate}</Text>
                            </Badge>

                            <MessageBubble message={message} />
                        </Stack>
                    );
                    return <MessageBubble key={message.id} message={message} />
                });
            })()}
        </Stack>

        <SendMessage />
    </>);
}