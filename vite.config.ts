import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    host: "127.0.0.1",
    strictPort: false,
  },
  ssr: {
    external: ["node:sqlite"],
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart({
      server: { entry: "./src/server.ts" },
    }),
    nitro(),
    tailwindcss(),
    viteReact(),
  ],
});
