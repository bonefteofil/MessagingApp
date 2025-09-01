import { useState } from "react";
import MessagesPage from "./components/MessagesPage"
import SendMessage from "./components/SendMessage"
import EditMessage from "./components/EditMessage"
import type Message from "./models/message";

export default function App() {
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1>Messages</h1>
      {editingMessage
        ? <EditMessage message={editingMessage} setEditingMessage={setEditingMessage} />
        : <SendMessage />
      }
      <MessagesPage setEditingMessage={setEditingMessage} />
    </div>
  )
}