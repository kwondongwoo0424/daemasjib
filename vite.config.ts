import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/daemasjib/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Daemasjib",
        short_name: "Daemasjib",
        start_url: "/daemasjib/",
        scope: "/daemasjib/",
        id: "/daemasjib/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/daegu": {
        target: "https://www.daegufood.go.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/daegu/, "/kor/api/tasty.html"),
      },
    },
  },
});
