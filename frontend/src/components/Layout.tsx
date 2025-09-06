import { useState } from "react";
import type Message from "../models/message";
import MessagesList from "./MessagesList"
import SendMessage from "./SendMessage"
import { Affix, Box } from "@mantine/core";

export default function Layout() {
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  return (
    <>
      <MessagesList setEditingMessage={setEditingMessage} />
      <Box h={70} />
      <Affix position={{ bottom: 0, left: 0, right: 0 }} zIndex={50} p='md' className="backdrop-blur-lg bg-gray-700/30">
          <SendMessage editingMessage={editingMessage} setEditingMessage={setEditingMessage} />
      </Affix>
    </>
  );
}