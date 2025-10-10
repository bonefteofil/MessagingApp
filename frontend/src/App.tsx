import { HashRouter, Routes, Route } from "react-router-dom";
import { Notifications } from '@mantine/notifications';
import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import DeleteUserPage from "./pages/DeleteUserPage";
import ChatPage from "./pages/ChatPage"
import SettingsPage from "./pages/SettingsPage";
import ResponsiveCard from "./components/ResponsiveCard";
import NotFoundPage from "./errors/404Page";
import ServerDownPage from "./errors/ServerDownPage";

export default function App() {
  	return (
		<HashRouter>
			<Notifications />

			<Routes>
				<Route path="*" element={<NotFoundPage />} />
				<Route path="/logout" element={<LogoutPage />} />

				<Route element={<ServerDownPage />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/delete-account" element={<DeleteUserPage />} />

					<Route element={<Layout />}>
						<Route path="/" element={<ResponsiveCard title="Welcome to Messaging App!" />} />
						<Route path="/groups/:groupId" element={<ChatPage />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Route>

				</Route>
			</Routes>
		</HashRouter>
  	);
}