import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: "https://digitalvandal.xyz",
  integrations: [tailwind(), react(), mdx({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
})],
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
