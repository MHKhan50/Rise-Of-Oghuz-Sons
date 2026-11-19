import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the game from /Rise-Of-Oghuz-Sons/; local development uses the root.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Rise-Of-Oghuz-Sons/" : "/",
  plugins: [react(), tailwindcss()],
}));
