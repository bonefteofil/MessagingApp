import { useLocation, Outlet } from "react-router-dom";

import { AppShell } from "@mantine/core";

import InboxPage from "@groups/InboxPage";


export default function Layout() {
	const location = useLocation();

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
}