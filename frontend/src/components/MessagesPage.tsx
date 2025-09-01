import { deleteMessage, getMessages } from '../queries/messagesQueries';
import type Message from '../models/message';

export default function MessagesPage({setEditingMessage}: { setEditingMessage: (message: Message | null) => void }) {
    const { isPending, error, data } = getMessages();
    const deleteMutation = deleteMessage();

    return (
        <>
            {isPending && <p>Loading...</p>}

            {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

            {data && data.map((message: Message) => (
                <div key={message.id} style={{gap: '10px', display: 'flex', alignItems: 'center', borderTop: '1px solid #eee', padding: '10px 0'}}>
                    Id: {message.id}, Text: {message.text}
                    <button onClick={() => setEditingMessage(message)}>
                        Edit
                    </button>
                    <button onClick={() => deleteMutation.mutate(message.id!)}>
                        {deleteMutation.isPending && deleteMutation.variables === message.id ? "Deleting..." : "Delete"}
                    </button>
                </div>
            ))}
        </>
    );
}