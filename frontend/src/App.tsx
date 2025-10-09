import { HashRouter, Routes, Route } from "react-router-dom";
import { Notifications } from '@mantine/notifications';
import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import DeleteUserPage from "./pages/DeleteUserPage";
import InboxPage from "./pages/InboxPage";
import ChatPage from "./pages/ChatPage"
import SettingsPage from "./pages/SettingsPage";
import ResponsiveCard from "./components/ResponsiveCard";
import Header from "./components/Header";
import NotFoundPage from "./errors/404Page";

export default function App() {
  	return (
		<HashRouter>
			<Notifications />

			<Routes>
				<Route element={<Layout />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/logout" element={<LogoutPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/delete-account" element={<DeleteUserPage />} />
					<Route path="*" element={<NotFoundPage />} />

					<Route element={<InboxPage />}>
						<Route path="/" element={<ResponsiveCard title="Welcome to Messaging App!" />} />
						<Route element={<Header />}>
							<Route path="/groups/:groupId" element={<ChatPage />} />
							<Route path="/settings" element={<SettingsPage />} />
						</Route>
					</Route>
				</Route>
			</Routes>
		</HashRouter>
  	);
}