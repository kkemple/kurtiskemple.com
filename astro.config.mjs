import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import crawlerFilesIntegration from "./src/integrations/crawler-files";

// https://astro.build/config
export default defineConfig({
  site: "https://kurtiskemple.com",
  integrations: [
    tailwind(),
    react(),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    crawlerFilesIntegration(),
  ],
  output: "static",
  adapter: netlify(),
  markdown: {
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      wrap: true,
      lineNumbers: true,
    },
  },
  image: {
    domains: ["localhost:4321", "kurtiskemple.com"],
  },
});
