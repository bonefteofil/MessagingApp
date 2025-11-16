import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

import App from '@/App';

import { EditingMessageProvider } from '@messages/components/EditingMessageContext';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CookiesProvider>
			<QueryClientProvider client={queryClient}>
				<MantineProvider defaultColorScheme="dark">
					<EditingMessageProvider>
						<App />
					</EditingMessageProvider>
				</MantineProvider>
			</QueryClientProvider>
		</CookiesProvider>
	</StrictMode>
);