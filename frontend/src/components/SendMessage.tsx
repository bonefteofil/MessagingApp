import { editMessage, sendMessage } from "../queries/messagesQueries";
import { useEffect } from "react";
import { faFloppyDisk, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Button, Group, Textarea, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import type MessageScheme from "../types/message";

interface SendMessageProps {
    groupId: number;
    editingMessage: MessageScheme | null;
    clearEditingMessage: () => void;
}

export default function SendMessage({ groupId, editingMessage, clearEditingMessage } : SendMessageProps) {
    const sendMutation = sendMessage();
    const editMutation = editMessage();

    const form = useForm({
        initialValues: {
            text: ""
        },
    });

    useEffect(() => {
        form.setValues({
            text: editingMessage?.text || "",
        });
    }, [editingMessage]);

    useEffect(() => {
        if (sendMutation.isSuccess || editMutation.isSuccess) {
            clearEditingMessage();
            form.reset();
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
        <form onSubmit={handleSubmit}>
            <Group>
                <Textarea
                    name="text"
                    placeholder="Type your message..."
                    disabled={sendMutation.isPending}
                    radius="md"
                    size="md"
                    className="flex-grow"
                    minRows={1}
                    maxRows={6}
                    autosize
                    styles={{ input: { backgroundColor: 'transparent', borderColor: 'lightgrey'} }}
                    {...form.getInputProps('text')}
                />

                {editingMessage ? (<>
                    <Button
                        variant="gradient"
                        type="button"
                        radius='md'
                        size='input-md'
                        onClick={() => clearEditingMessage()}
                    >
                        <Text>Cancel</Text>
                    </Button>
                    <Button
                        variant="gradient"
                        type="submit"
                        radius='md'
                        size='input-md'
                        loading={editMutation.isPending}
                        loaderProps={{ size: 'sm' }}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                        <Text ml='xs'>Save</Text>
                    </Button>
                </>) : (
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
    );
}