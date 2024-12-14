---
title: "Add inline syntax highlighting to Astro"
description: "Use Shiki to highlight inline code elements in markdown files"
pubDate: 2024-12-12T14:57:06.528Z
tags: [devblog, astro, shiki, markdown]
image: "@assets/add-inline-syntax-highlighting-to-astro/images/header.png"
---

![doge head admiring inline highlighting and saying wow such highlighting](@assets/add-inline-syntax-highlighting-to-astro/images/header.png "Very syntax")

I started using Astro to build my site at the end of 2023. It's been a great experience overall, but one thing has bothered me: there's no inline syntax highlighting in markdown files. It's especially frustrating because the syntax highlighting in code blocks is great. But check this out: `Math.max(1, 2){:js}`. I figured out how to get it working!

Astro uses [Shiki](https://shiki.style/) under the hood to handle [syntax highlighting](https://docs.astro.build/en/guides/syntax-highlighting/). It can highlight a ton of [languages](https://shiki.style/languages#bundled-languages) out of the box, it comes with plenty of great [themes](https://shiki.style/themes#bundled-themes), and it's fast. But ultimately, it comes bundled with Astro, so that's what I use.

Prior to August 2022, inline highlighting wasn't a [feature](https://github.com/shikijs/shiki/pull/751) of Shiki. But now that it's been [added](https://shiki.style/packages/rehype#inline-code) ([v1.15.0](https://github.com/shikijs/shiki/releases/tag/v1.15.0)), and now that Astro 5 has updated Shiki to [v1.23.1](https://github.com/withastro/astro/blob/799c8676dfba0d281faf2a3f2d9513518b57593b/packages/markdown/remark/package.json#L48) (in the [@astrojs/markdown-remark](https://github.com/withastro/astro/tree/main/packages/markdown/remark) package), we can use it in Astro.

Here's how I added it to my site:
- Add the [Shiki rehype plugin](https://shiki.style/packages/rehype#shikijs-rehype) to your project:
  ```console
  npm add -D @shikijs/rehype
  ```
- Update your `astro.config.ts{:console}` file to include this plugin:
  ```js
  import rehypeShiki from "@shikijs/rehype"
  ...
  export default defineConfig({
    ...
    markdown: {
      rehypePlugins: [
        [
          rehypeShiki,
          {
            inline: "tailing-curly-colon",
            theme: "one-dark-pro",
          },
        ],
      ],
      shikiConfig: {
        theme: "one-dark-pro",
      },
    },
  });
  ```
- Use the correct... _syntax_, to start using this feature:

  This markdown:
  ```markdown
  Log your log with `console.log(log)`
  ```
  Changes into this:
  ```markdown
  Log your log with `console.log(log){:js}`
  ```

Do you see the new curly brace syntax at the end of the second example? You include the language specifier that you want in there and Shiki does the rest.

## Alternatives

If you don't want to use the Shiki plugin, there are a couple of alternative options for adding inline syntax highlighting.

### Use the Astro `<Code />{:astro}` component

Astro provides two [components](https://docs.astro.build/en/guides/syntax-highlighting/#components-for-code-blocks) to render code blocks in `.astro{:console}` and `.mdx{:console}` files: `<Code />{:astro}` and `<Prism />{:astro}`, but only the `<Code />{:astro}` component can provide inline highlighting:

```astro
<Code code={`awesomeFunction()`} lang="js" inline />
```

I prefer to use the Shiki solution above. Using the `<Code />{:astro}` component feels like using a pile driver to hammer in a nail. Plus, you can't use it in regular markdown files. But it exists and might be a better solution for some.

### Use CSS

Yes, good old CSS can work in a pinch. This is how I got highlighting to work when I started using Astro. My solution only provided highlighting in one style:
```css
code {
  padding: 5px 2px;
  background-color: #646464;
  border-radius: 2px;
}
```
That looks like this:
<code style="padding: 5px 2px; background-color: #646464; border-radius: 2px;">awesomeFunction()</code>

Not great, but it's something 🤷.

## Adding a custom language

What if Shiki doesn't include support for a language out of the box? You can add your own! In another life, I used [AutoHotKey](https://www.autohotkey.com/) on Windows and wrote about it on this [site](/posts/add-windows-keyboard-shortcuts-with-autohotkey/). Shiki doesn't support highlighting AutoHotKey scripts natively, so you need to add a custom language. Per the documentation:
> You can load custom languages by passing a TextMate grammar object into the `langs{:js}` array.

There's an AutoHotKey VS Code [extension](https://github.com/mark-wiemer-org/ahkpp) that provides syntax highlighting and it includes the grammar object that can be used by Shiki (in the LSP). Here's how you can add it:

- Download the grammar object [here](https://raw.githubusercontent.com/mark-wiemer-org/ahk2-lsp/5be918325917ddc9a3500778c30a55ca5dd4086d/syntaxes/ahk2.tmLanguage.json) and save it to your project. I placed it in `src/grammars:{:console}`.
- Update the `shikiConfig{:js}` section of `astro.config.ts{:console}` to reference the new grammar object:
  ```js
  import ahkGrammar from "./src/grammars/ahk2.tmLanguage.json";
  ...
  export default defineConfig({
    ...
    markdown: {
      ...
      shikiConfig: {
        langs: [{
          ...ahkGrammar,
          aliases: ["ahk"], // 👈️ A shorter specifier
        }]
        ...
      },
    },
  });
  ```
- Start using the custom highlighting:
  
  This markdown block:
  ````markdown
  ```ahk
  ; Shortcut for work email
  ::emi::
    SendInput your.name@example.com
    TrayTip, , Text 'emi' Expanded, 2
  Return
  ```
  ````
  Will end up looking like this:
  ```ahk
  ; Shortcut for work email
  ::emi::
    SendInput your.name@example.com
    TrayTip, , Text 'emi' Expanded, 2
  Return
  ```

## Final thoughts

I'm happy that my inline code can now be highlighted and it didn't require a whole lot of work. But it is a bit annoying to have to add the specifier at the end of each instance. I'm pretty sure that you'll be seeing me missing the colon in the future (`myBadCode{js}`).

Overall, it was a fun exercise to get everything wired up and make my site look a small bit better. Good luck implementing this solution on your own site! If you come up with an improvement, please let me know using one of those social links below.