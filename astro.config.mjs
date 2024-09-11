import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://digitalvandal.xyz",
  integrations: [tailwind(), react(), mdx()],
  output: "hybrid",
  adapter: netlify(),
  markdown: {
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      wrap: true,
      lineNumbers: true,
    },
  },
  image: {
    domains: ["localhost:4321", "localhost:4322", "digitalvandal.xyz"],
  },
});
