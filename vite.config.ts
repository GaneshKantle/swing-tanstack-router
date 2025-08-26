import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/routes',
      target: 'react',
      // autoCodeSplitting: true,
    }),
    react()],
  server: {
    port: 3000, // Change this to any port you prefer
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@tanstack/react-router'],
  },
});
