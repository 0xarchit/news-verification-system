import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "News Verifier",
        short_name: "NewsCheck",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/image.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      // Remove precaching of HTML so UI is always fetched fresh
      workbox: {
        globPatterns: ["**/*.{js,css,ico,png,svg}"], // html removed
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    allowedHosts: [
      "0xdaddy.ogserver.eu.org",
      "0xarchit.ogserver.eu.org",
      "0xarc.ogserver.eu.org",
      "news.ogserver.eu.org",
      // Add tunnel domains
      "fake-news.0xarchit.is-a.dev",
      "fetch.0xarchit.is-a.dev",
      "gemini.0xarchit.is-a.dev",
      "0xarchit.is-a.dev",
    ],
  },
  build: {
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Handle SPA routing in production build
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  preview: {
    port: 5173,
  },
});
