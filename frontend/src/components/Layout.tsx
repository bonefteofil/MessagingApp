import { useState } from "react";
import MessagesList from "./MessagesList"
import SendMessage from "./SendMessage"
import EditMessage from "./EditMessage"
import type Message from "../models/message";

export default function App() {
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  return (
    <div className="flex flex-col gap-4 p-5 h-dvh">
        <h1 className="text-2xl font-bold p-2 border rounded-sm">Messaging App</h1>
        <MessagesList setEditingMessage={setEditingMessage} />
        {editingMessage
            ? <EditMessage message={editingMessage} setEditingMessage={setEditingMessage} />
            : <SendMessage />
        }
    </div>
  )
}