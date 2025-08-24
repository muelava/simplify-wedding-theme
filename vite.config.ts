import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "localhost", // Often included by default, keep if desired
      "8213a85e32ad.ngrok-free.app", // Add your ngrok host here
    ],
  },
});
