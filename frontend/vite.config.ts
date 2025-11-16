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
			'@user': resolve(__dirname, 'src/pages/user'),
			'@groups': resolve(__dirname, 'src/pages/groups'),
			'@messages': resolve(__dirname, 'src/pages/messages'),
            '@errors': resolve(__dirname, 'src/pages/errors'),
            '@components': resolve(__dirname, 'src/components'),
            '@api': resolve(__dirname, 'src/api'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@schema': resolve(__dirname, 'src/schema')
		}
	},
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5029',
                // target: 'https://messaging.bonefteofil.ro/api',
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
