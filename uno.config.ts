import { defineConfig, presetIcons, presetWind } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  presets: [
    presetIcons({
      collections: {
        bi: () => import("@iconify-json/bi/icons.json").then(i => i.default),
      },
    }),
    presetWind(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})