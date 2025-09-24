import { useContext } from "react";
import ChatPage from "./ChatPage"
import InboxPage from "./InboxPage";
import WelcomePage from "./WelcomePage";
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
				breakpoint: 'md',
				collapsed: { mobile: !!currentGroup, desktop: false },
			}}
		>
			{currentGroup && (
				<AppShell.Header p='sm' ml={{ base: 0, md: navbarSize }} className="!backdrop-blur-lg !bg-gray-700/30" >
					<Header />
				</AppShell.Header>
			)}

			<AppShell.Navbar>
				<InboxPage />
			</AppShell.Navbar>

			<AppShell.Main py={80}>
				{currentGroup ? (
					<ChatPage />
				) : (
					<WelcomePage />
				)}
			</AppShell.Main>

			{currentGroup && <SendMessage />}
		</AppShell>
  	);
}