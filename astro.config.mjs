import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";

let tailwindPlugin = null;

try {
  const { default: tailwindcss } = await import("@tailwindcss/vite");
  tailwindPlugin = tailwindcss();
} catch {
  console.warn("[astro] Optional dependency '@tailwindcss/vite' is not installed. Run 'npm install' to enable Tailwind CSS.");
}

export default defineConfig({
  integrations: [alpinejs()],
  vite: {
    plugins: tailwindPlugin ? [tailwindPlugin] : []
  }
});
