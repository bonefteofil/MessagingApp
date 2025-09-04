import { sendMessage } from "../queries/messagesQueries";
import Button from "./Button";
import { useEffect, useRef } from "react";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export default function SendMessage() {
    const sendMutation = sendMessage();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (sendMutation.isSuccess && formRef.current) { 
            formRef.current.reset();
        }
    }, [sendMutation.isSuccess]);
    return (
        <form
            ref={formRef}
            className="flex gap-2 w-full"
            onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const newMessage = formData.get('text') as string;
            sendMutation.mutate({ text: newMessage });
            }}
        >
            <input
                type="text"
                name="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-xl w-full"
            />
            <Button
              icon={faPaperPlane}
              loading={sendMutation.isPending}
            />
        </form>
    );
}