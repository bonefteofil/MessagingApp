import { useContext } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import ChatPage from "./ChatPage"
import InboxPage from "./InboxPage";
import WelcomePage from "./WelcomePage";
import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";
import NotFoundPage from "./404Page";
import SettingsPage from "./SettingsPage";

export default function Layout() {
	const { currentGroup } = useContext(CurrentGroupContext);

	return (
		<AppShell
			withBorder={false}
			navbar={{
				width: 400,
				breakpoint: 'md',
				collapsed: { mobile: (!!currentGroup), desktop: false },
			}}
		>
			<HashRouter>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/logout" element={<LogoutPage />} />
					<Route path="*" element={<NotFoundPage />} />

					<Route element={<InboxPage />}>
						<Route path="/" element={<WelcomePage />} />
						<Route path="/settings" element={<SettingsPage />} />
						<Route path="/groups/:groupId" element={<ChatPage />} />
					</Route>
				</Routes>
			</HashRouter>
		</AppShell>
  	);
}