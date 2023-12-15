import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro"

export default defineConfig({
  site: "https://camdecoster.dev",
  integrations: [
    mdx(),
    sitemap(),
    UnoCSS({ injectReset: true }),
  ],
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
    },
  },
});
