import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "shell",
        remotes: {
          orders: {
            type: "module",
            name: "orders",
            entry: env.ORDERS_REMOTE_URL
          }
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
        }
      })
    ],
    build: {
      target: 'esnext'
    }
  }
})