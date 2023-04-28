import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: { host: true },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
