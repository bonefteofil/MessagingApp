import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Stack, Text, Badge, Card, Avatar, Button } from "@mantine/core";

import { getMessages } from '@api/messages';
import { getGroupById } from '@api/groups';

import SendMessage from '@messages/components/SendMessage';
import MessageBubble from '@messages/components/MessageBubble';
import Header from '@components/Header';
import Loading from '@components/Loading';
import ErrorPage from '@errors/ErrorPage';

import type MessageScheme from '@schema/messages';


export default function ChatPage() {
    const navigate = useNavigate();
    const params = useParams();
    const { data: groupData, error: groupError } = getGroupById(Number(params.groupId));
    const { data: messages, isLoading, error: messagesError } = getMessages(params.groupId!);
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
    
    return (<>
        {/* Page header */}
        <Header element={
            <Button variant='transparent' onClick={() => navigate("details")}>
                {!groupError ? <>
                    <Avatar />
                    <Text size="sm" truncate="end">{groupData?.name}</Text>
                    <div style={{ flexGrow: 1 }} />
                </> : <Text size="sm" truncate="end" c="red">{groupError.message}</Text>}
            </Button>
        } />

        {/* Messages list */}
        <Stack p='md'>
            {!groupError &&
                <Card mx='auto' radius='md' color='gray' mt='md' className='text-center'>
                    <Text size='md' c='dimmed'>
                        The group "{groupData?.name}" was created on
                        <br />
                        {groupData?.createdAt}
                    </Text>
                </Card>
            }

            {messagesError && !messages && <ErrorPage message={messagesError.message} />}
            <Loading loading={isLoading} />
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

        {/* Message input */}
        <SendMessage />
    </>);
}