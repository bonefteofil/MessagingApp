import { HashRouter, Routes, Route } from "react-router-dom";

import { Notifications } from '@mantine/notifications';

import Layout from "@components/Layout";
import ResponsiveCard from "@components/ResponsiveCard";

import Status from "@components/Status";
import ChatPage from "@messages/ChatPage"
import GroupPage from "@groups/GroupPage";
import NotFoundPage from "@errors/404Page";

import AccountPage from "@user/AccountPage";
import LoginPage from "@user/LoginPage";
import LogoutPage from "@user/LogoutPage";
import RegisterPage from "@user/RegisterPage";
import DeleteAccountPage from "@user/DeleteAccountPage";


export default function App() {
  	return (
		<HashRouter>
			<Notifications />

			<Routes>
				<Route element={<Status />}>
					<Route path="*" element={<NotFoundPage />} />
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<RegisterPage />} />
					<Route path="logout" element={<LogoutPage />} />

					<Route element={<Layout />}>
						<Route path="" element={<ResponsiveCard title="Welcome to Messaging App!" />} />
						<Route path="groups/:groupId" element={<ChatPage />} />
						<Route path="groups/:groupId/details" element={<GroupPage />} />
						<Route path="account" element={<AccountPage />} >
							<Route path="delete" element={<DeleteAccountPage />} /> 
						</Route>
					</Route>
				</Route>
			</Routes>
		</HashRouter>
  	);
}