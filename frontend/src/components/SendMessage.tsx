import { sendMessage } from "../queries/messagesQueries";

export default function SendMessage() {
    const sendMutation = sendMessage();
    
    return (
        <form style={{display: 'flex', gap: '10px', marginBottom: '20px'}} onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const newMessage = formData.get('text') as string;
            sendMutation.mutate({ text: newMessage });
            (e.target as HTMLFormElement).reset();
        }}>
            <input type="text" name="text" placeholder="Type your message..."
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
            />

            <button type="submit">Send</button>
        </form>
    );
}