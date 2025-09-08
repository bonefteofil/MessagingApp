import { useState } from "react";
import type MessageScheme from "../types/message";
import MessagesList from "./MessagesList"
import SendMessage from "./SendMessage"
import { Affix, Box, Center, Text } from "@mantine/core";
import Menu from "./Menu";
import type GroupScheme from "../types/group";

export default function Layout() {
	const [editingMessage, setEditingMessage] = useState<MessageScheme | null>(null);
	const [currentGroup, setCurrentGroup] = useState<GroupScheme | null>(null);

  	return (
		<>
			<Menu currentGroup={currentGroup} setCurrentGroup={setCurrentGroup} />
			<Center><Text size="xl" mt={20}>Current group: {currentGroup ? `${currentGroup.name} (ID: ${currentGroup.id})` : "None selected"}</Text></Center>
			{currentGroup ? (
				<MessagesList setEditingMessage={setEditingMessage} groupId={currentGroup.id!}/>
			) : (
				<Center><Text m={60}>No group selected. Please select a group from the menu.</Text></Center>
			)}
			<Box h={70} />

			{currentGroup && (
				<Affix
					position={{ bottom: 0, left: 0, right: 0 }}
					zIndex={50}
					p="md"
					className="backdrop-blur-lg bg-gray-700/30"
				>
					<SendMessage
						editingMessage={editingMessage}
						groupId={currentGroup.id!}
						clearEditingMessage={() => setEditingMessage(null)}
					/>
				</Affix>
			)}
		</>
  	);
}