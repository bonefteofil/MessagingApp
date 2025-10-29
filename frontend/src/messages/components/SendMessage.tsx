import { useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";

import { faFloppyDisk, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Button, Group, Textarea, Text, Affix, Card, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

import { editMessage, sendMessage } from "@messages/api";

import EditingMessageContext from "@messages/Context";


export default function SendMessage() {
    const { editingMessage, setEditingMessage } = useContext(EditingMessageContext);
    const groupId = Number(useParams().groupId);
    const sendMutation = sendMessage();
    const editMutation = editMessage();
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const form = useForm({
        initialValues: {
            text: ""
        }
    });
    
    useEffect(() => {
        // Focus the input when the current group or editing message changes
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [groupId, editingMessage]);

    useEffect(() => {
        form.setValues({
            text: editingMessage?.text || "",
        });
    }, [editingMessage]);

    useEffect(() => {
        if (sendMutation.isSuccess || editMutation.isSuccess) {
            setEditingMessage(null);
            form.reset();
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [sendMutation.isSuccess, editMutation.isSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMessage) {
            editMutation.mutate({ id: editingMessage.id, text: form.values.text, groupId: editingMessage.groupId });
        } else {
            sendMutation.mutate({ text: form.values.text, groupId: groupId });
        }
    };

    return (
        <Affix
            position={{ bottom: 0, left: 0, right: 0 }}
            zIndex={50}
            my='md'
            ml={{ base: 0, md: 400 }}
        >
            <Card p='sm' mx='md' withBorder radius='lg' className="!backdrop-blur-lg !bg-gray-700/30">
                <form onSubmit={handleSubmit}>
                    <Group wrap="nowrap" gap='sm'>
                        <Textarea
                            ref={inputRef}
                            name="text"
                            className="flex-grow"
                            radius="md"
                            size="md"
                            minRows={editingMessage ? 3 : 1}
                            maxRows={6}
                            autosize
                            placeholder="Type your message..."
                            disabled={sendMutation.isPending}
                            styles={{ input: { backgroundColor: 'transparent', borderColor: 'lightgrey' } }}
                            {...form.getInputProps('text')}
                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    (e.target as HTMLTextAreaElement).form?.dispatchEvent(
                                        new Event('submit', { cancelable: true, bubbles: true })
                                    );
                                }
                            }}
                        />

                        {editingMessage ? (
                            <Stack gap='sm'>
                                <Button
                                    variant="gradient"
                                    type="submit"
                                    radius='md'
                                    size="sm"
                                    loading={editMutation.isPending}
                                    loaderProps={{ size: 'sm' }}
                                >
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                    <Text ml='xs'>Save</Text>
                                </Button>
                                <Button
                                    variant="gradient"
                                    type="button"
                                    radius='md'
                                    size='sm'
                                    onClick={() => setEditingMessage(null)}
                                >
                                    <Text>Cancel</Text>
                                </Button>
                            </Stack>
                        ) : (
                            <ActionIcon
                                variant="gradient"
                                type="submit"
                                radius='md'
                                size='input-md'
                                loading={sendMutation.isPending}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </ActionIcon>
                        )}
                    </Group>
                </form>
            </Card>
        </Affix>
    );
}