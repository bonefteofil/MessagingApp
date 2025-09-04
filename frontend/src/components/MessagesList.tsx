import { deleteMessage, getMessages } from '../queries/messagesQueries';
import type Message from '../models/message';
import Button from './Button';
import { useEffect, useRef } from 'react';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function MessagesList({setEditingMessage}: { setEditingMessage: (message: Message | null) => void }) {
    const { isPending, error, data } = getMessages();
    const deleteMutation = deleteMessage();
    const containerRef = useRef<HTMLDivElement>(null);

    const firstLoad = useRef(true);

    useEffect(() => {
        if (containerRef.current && data) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: firstLoad.current ? 'auto' : 'smooth'
            });
            firstLoad.current = false;
        }
    }, [data]);

    return (
        <div ref={containerRef} className="flex flex-col w-full h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden">

            {(isPending || !data) && (
                <div className="flex h-full justify-center items-center">
                    <FontAwesomeIcon icon={faSpinner} size="4x" className="animate-spin" />
                </div>
            )}

            {error && (
                <div className='h-full flex justify-center'>
                    <p className="bg-red-700 rounded-xl p-4 h-min">Error loading messages: {error?.message || "Unknown error"}</p>
                </div>
            )}

            {data && data.map((message: Message) => (
                <div key={message.id} className="flex items-center justify-between my-2">
                    <div className='p-3 rounded-xl bg-green-700 max-w-4/6 wrap-anywhere'>{message.id}, {message.text || "NULL"}</div>
                    <div>
                        <Button onClick={() => setEditingMessage(message)} icon={faPenToSquare} />
                        <Button
                            onClick={() => deleteMutation.mutate(message.id!)}
                            icon={faTrash}
                            loading={deleteMutation.isPending && deleteMutation.variables === message.id}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}