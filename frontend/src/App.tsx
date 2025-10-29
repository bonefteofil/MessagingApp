import { HashRouter, Routes, Route } from "react-router-dom";
import { Notifications } from '@mantine/notifications';
import Layout from "./shared/components/Layout";
import LoginPage from "./user/pages/LoginPage";
import LogoutPage from "./user/pages/LogoutPage";
import RegisterPage from "./user/pages/RegisterPage";
import DeleteAccountPage from "./user/pages/DeleteAccountPage";
import ChatPage from "./messages/pages/ChatPage"
import AccountPage from "./user/pages/AccountPage";
import ResponsiveCard from "./shared/components/ResponsiveCard";
import NotFoundPage from "./shared/errors/404Page";
import ServerDownPage from "./shared/errors/ServerDownPage";

export default function App() {
  	return (
		<HashRouter>
			<Notifications />

			<Routes>
				<Route element={<ServerDownPage />}>
					<Route path="*" element={<NotFoundPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/logout" element={<LogoutPage />} />
					<Route path="/delete-account" element={<DeleteAccountPage />} />

					<Route element={<Layout />}>
						<Route path="/" element={<ResponsiveCard title="Welcome to Messaging App!" />} />
						<Route path="/groups/:groupId" element={<ChatPage />} />
						<Route path="/settings" element={<AccountPage />} />
					</Route>
				</Route>
			</Routes>
		</HashRouter>
  	);
}