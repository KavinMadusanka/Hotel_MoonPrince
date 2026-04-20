import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",          // 🔥 expose to Docker host
    port: 5173,          // (optional but good to be explicit)
    watch: {
      usePolling: true,  // 🔥 FIX: enables hot reload in Docker (Windows)
    },
  },
});
