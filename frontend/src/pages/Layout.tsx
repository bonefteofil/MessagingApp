import { useLocation, Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";

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
			<Outlet />
		</AppShell>
  	);
}