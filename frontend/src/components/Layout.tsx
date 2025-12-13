import { useLocation, Outlet } from "react-router-dom";

import { AppShell } from "@mantine/core";

import { FetchServerStatus } from "@api/fetchServerStatus";

import InboxPage from "@groups/InboxPage";
import ServerDownPage from "@errors/ServerDownPage";


export default function Layout() {
	const location = useLocation();
	const { error } = FetchServerStatus();

	if (!error)

	return (
		<AppShell
			withBorder={false}
			navbar={{
				width: 400,
				breakpoint: 'md',
				collapsed: { mobile: location.pathname !== "/", desktop: false },
			}}
		>
			<InboxPage />

			<AppShell.Main pt={50} pb={90}>
				<Outlet />
			</AppShell.Main>
		</AppShell>
  	);
	return  <ServerDownPage />;
}