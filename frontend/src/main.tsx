import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

import App from '@/App';

import { UserProvider } from '@user/Context';
import { DeveloperModeProvider } from '@components/DeveloperModeContext';
import { GroupProvider } from '@groups/Context';
import { EditingMessageProvider } from '@messages/Context';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider defaultColorScheme="dark">
				<UserProvider>
					<DeveloperModeProvider>
						<GroupProvider>
							<EditingMessageProvider>
								<App />
							</EditingMessageProvider>
						</GroupProvider>
					</DeveloperModeProvider>
				</UserProvider>
			</MantineProvider>
		</QueryClientProvider>
	</StrictMode>
);