import type Message from "../models/message";
import { editMessage } from "../queries/messagesQueries";
import { useEffect } from "react";

export default function EditMessage({ message, setEditingMessage } : {message: Message, setEditingMessage: (message: Message | null) => void }) {
    const editMutation = editMessage();

    useEffect(() => {
        if (editMutation.isSuccess) { setEditingMessage(null); }
    }, [editMutation.isSuccess]);

    return (
        <>
            <p>Edit Message {message.id}</p>
            <form style={{display: 'flex', gap: '10px', marginBottom: '20px'}} onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newMessage = formData.get('text') as string;
                editMutation.mutate({ id: message.id!, text: newMessage });
            }}>
                <input type="text" name="text" defaultValue={message.text}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
                />

                <button type="button" onClick={() => setEditingMessage(null)}>Cancel</button>
                <button type="submit">
                    Save
                </button>
            </form>
        </>
    );
}