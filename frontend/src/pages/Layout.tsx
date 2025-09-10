import { useContext } from "react";
import ChatPage from "./ChatPage"
import InboxPage from "./InboxPage";
import WellcomePage from "./WellcomePage";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import { AppShell } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";

export default function Layout() {
	const { currentGroup } = useContext(CurrentGroupContext);
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
					<Header />
				</AppShell.Header>
			)}

			<AppShell.Navbar>
				<InboxPage />
			</AppShell.Navbar>

			<AppShell.Main bg={currentGroup ? "gray.9" : undefined} py={70}>
				{currentGroup ? (
					<ChatPage />
				) : (
					<WellcomePage />
				)}
			</AppShell.Main>

			{currentGroup && 
				<AppShell.Footer p='md' ml={{ base: 0, sm: navbarSize }} className="!backdrop-blur-lg !bg-gray-700/30">
					<SendMessage />
				</AppShell.Footer>
			}
		</AppShell>
  	);
}