import { useState } from "react";
import type MessageScheme from "../types/message";
import type GroupScheme from "../types/group";
import ChatPage from "./ChatPage"
import InboxPage from "./InboxPage";

export default function Layout() {
	const [editingMessage, setEditingMessage] = useState<MessageScheme | null>(null);
	const [currentGroup, setCurrentGroup] = useState<GroupScheme | null>(null);

  	return (
		<>
			{!currentGroup ? (
				<InboxPage setCurrentGroup={setCurrentGroup} />
			) : (
				<ChatPage
					currentGroup={currentGroup}
					editingMessage={editingMessage}
					setEditingMessage={setEditingMessage}
					removeGroup={() => setCurrentGroup(null)}
				/>
			)}
		</>
  	);
}