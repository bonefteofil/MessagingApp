import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from './App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { GroupProvider } from './contexts/CurrentGroupContext';
import { EditingMessageProvider } from './contexts/EditingMessageContext';
import { DeveloperModeProvider } from './contexts/DeveloperModeContext';
import { UserProvider } from './contexts/CurrentUserContext';

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