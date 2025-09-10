import type MessageScheme from "../types/message";
import type GroupScheme from "../types/group";
import { useState } from "react";
import ChatPage from "./ChatPage"
import InboxPage from "./InboxPage";
import WellcomePage from "./WellcomePage";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import { AppShell } from "@mantine/core";

export default function Layout() {
	const [editingMessage, setEditingMessage] = useState<MessageScheme | null>(null);
	const [currentGroup, setCurrentGroup] = useState<GroupScheme | null>(null);
	const navbarSize = 400;

	return (
		<AppShell
			withBorder={false}
			navbar={{
				width: navbarSize,
				breakpoint: 'sm',
				collapsed: { mobile: !!currentGroup, desktop: false },
			}}
		>
			{currentGroup && (
				<AppShell.Header p='sm' ml={{ base: 0, sm: navbarSize }} className="!backdrop-blur-lg !bg-gray-700/30" >
					<Header currentGroup={currentGroup} removeCurrentGroup={() => setCurrentGroup(null)} />
				</AppShell.Header>
			)}

			<AppShell.Navbar>
				<InboxPage setCurrentGroup={setCurrentGroup} />
			</AppShell.Navbar>

			<AppShell.Main bg={currentGroup ? "gray.9" : undefined} py={70}>
				{currentGroup ? (
					<ChatPage currentGroup={currentGroup} setEditingMessage={setEditingMessage} />
				) : (
					<WellcomePage />
				)}
			</AppShell.Main>

			{currentGroup && 
				<AppShell.Footer p='md' ml={{ base: 0, sm: navbarSize }} className="!backdrop-blur-lg !bg-gray-700/30">
					<SendMessage groupId={currentGroup.id!} editingMessage={editingMessage} clearEditingMessage={() => setEditingMessage(null)} />
				</AppShell.Footer>
			}
		</AppShell>
  	);
}