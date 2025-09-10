import './index.css';
import '@mantine/core/styles.css';
import App from './App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { GroupProvider } from './contexts/CurrentGroupContext';
import { EditingMessageProvider } from './contexts/EditingMessageContext';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider defaultColorScheme="dark">
				<GroupProvider>
					<EditingMessageProvider>
						<App />
					</EditingMessageProvider>
				</GroupProvider>
			</MantineProvider>
		</QueryClientProvider>
	</StrictMode>
);