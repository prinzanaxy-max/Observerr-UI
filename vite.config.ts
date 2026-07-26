import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), cloudflare()],
    server: {
      port: parseInt(env.VITE_PORT ?? '5173', 10),
      strictPort: true, // fail instead of silently trying the next port
    },
  };
})