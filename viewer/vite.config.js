import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/melt-maps/",
  plugins: [react()],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    include: ["mapbox-gl"],
  },
});
