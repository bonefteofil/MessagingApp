import { useLocation, Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import InboxPage from "../../groups/pages/InboxPage";
import Header from "../../messages/components/Header";

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
			<Header />

			<AppShell.Main py={80}>
				<Outlet />
			</AppShell.Main>
		</AppShell>
  	);
}