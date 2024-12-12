import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeShiki from "@shikijs/rehype"
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro"
import ahkGrammar from "./src/grammars/ahk2.tmLanguage.json";

const SHIKI_THEME = "one-dark-pro";

export default defineConfig({
  site: "https://camdecoster.dev",
  integrations: [
    mdx(),
    sitemap(),
    UnoCSS({ injectReset: true }),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeShiki,
        {
          inline: "tailing-curly-colon",
          theme: SHIKI_THEME,
        },
      ],
    ],
    shikiConfig: {
      langs: [{
        ...ahkGrammar,
        aliases: ["ahk"],
      }],
      theme: SHIKI_THEME,
    },
  },
});
