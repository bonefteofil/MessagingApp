import { defineConfig } from 'vite'
import { resolve } from 'path';

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        tailwindcss(),
    ],
    base: '/',
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@user': resolve(__dirname, 'src/user'),
			'@groups': resolve(__dirname, 'src/groups'),
			'@messages': resolve(__dirname, 'src/messages'),
            '@components': resolve(__dirname, 'src/shared/components'),
            '@utils': resolve(__dirname, 'src/shared/utils'),
            '@errors': resolve(__dirname, 'src/shared/errors'),
		}
	},
    server: {
        proxy: {
            '/api': {
                // target: 'http://localhost:5029',
                target: 'https://messaging.bonefteofil.ro/api',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
    }
})
