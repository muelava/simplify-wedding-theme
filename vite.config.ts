import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "localhost", // Often included by default, keep if desired
      "a22f5b6ae67b.ngrok-free.app", // Add your ngrok host here
    ],
  },
});
