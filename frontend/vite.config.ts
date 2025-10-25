import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        tailwindcss(),
    ],
    base: '/',
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
