import { useContext, useState } from "react";
import ChatPage from "./ChatPage"
import InboxPage from "./InboxPage";
import WelcomePage from "./WelcomePage";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import { AppShell } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Layout() {
	const { currentUser } = useContext(CurrentUserContext);
	const { currentGroup } = useContext(CurrentGroupContext);
	const [selectUser, setSelectUser] = useState<boolean>(true);
	const navbarSize = 400;

	return (
		<AppShell
			withBorder={false}
			navbar={{
				width: navbarSize,
				breakpoint: 'md',
				collapsed: { mobile: (!!currentGroup || !!selectUser), desktop: !currentUser },
			}}
		>
			{currentGroup && (
				<AppShell.Header p='sm' ml={{ base: 0, md: navbarSize }} className="!backdrop-blur-lg !bg-gray-700/30" >
					<Header />
				</AppShell.Header>
			)}

			{currentUser && (
				<AppShell.Navbar>
					<InboxPage setSelectUser={setSelectUser} />
				</AppShell.Navbar>
			)}

			<AppShell.Main py={80}>
				{currentGroup ? (
					<ChatPage />
				) : (
					<WelcomePage setSelectUser={setSelectUser} />
				)}
			</AppShell.Main>

			{currentGroup && <SendMessage />}
		</AppShell>
  	);
}