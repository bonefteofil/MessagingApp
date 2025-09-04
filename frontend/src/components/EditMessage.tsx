import type Message from "../models/message";
import { editMessage } from "../queries/messagesQueries";
import { useEffect } from "react";
import Button from "./Button";

export default function EditMessage({ message, setEditingMessage } : {message: Message, setEditingMessage: (message: Message | null) => void }) {
    const editMutation = editMessage();

    useEffect(() => {
        if (editMutation.isSuccess) { setEditingMessage(null); }
    }, [editMutation.isSuccess]);

    return (
        <div className="flex flex-col items-center gap-4">
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

                <Button text="Cancel" onClick={() => setEditingMessage(null)} />
                <Button text="Save" />
            </form>
        </div>
    );
}