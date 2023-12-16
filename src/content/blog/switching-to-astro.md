---
title: "Switching to Astro"
description: "My thoughts on switching the blog platform to Astro"
pubDate: 2023/12/16
tags: [devblog, astro, hugo]
image: "@assets/switching-to-astro/images/header.png"
---

![astro logo with word blog](@assets/switching-to-astro/images/header.png "Astro Blog")

If you've been to this site before, you might notice that things look different. That's because I switched static site generators. What was once created with [Hugo](https://gohugo.io/) is now created with [Astro](https://astro.build/):

> Astro is a web framework that takes the best from the early internet (think HTML and CSS) and puts it to work in a next-gen architecture to make every Astro site, and the whole web, faster.

In other words, you can build fast sites that incorporate existing components from frameworks like React, Vue, Svelte, etc. That opens a lot of possibilities.

## Why the change?

I got the itch to update things when Observable laid me off [recently](/posts/startups-are-hard/). Back in 2020, I built my first portfolio (now archived [here](https://github.com/camdecoster/portfolio)) to showcase some of the projects that I had worked on. It was supposed to be an example showing that I could actually develop web applications. Around that same time, I started posting about technical things on Medium for the same reason. I eventually moved those posts here using Hugo, but the portfolio remained where it was. I always wanted to use one site to showcase my work instead of two, so this itch seemed like a great opportunity to take care of that.

I looked for a new Hugo theme that would work for this, but I couldn't find one that would combine my blog and my portfolio appropriately. Astro eventually showed up in my search, and I learned about its JSX-like syntax. I've spent the last 18 months building a site using React/Next, so this appealed to me. It also meant that it would be easy to compose components and reuse code. You can do something similar with [partials](https://gohugo.io/templates/partials/) in Hugo, but I'm... _partial_ ... to JavaScript, so I decided to try Astro.

## Building my first Astro project

There are plenty of [tutorials](https://docs.astro.build/en/getting-started/) out there for how to build an Astro project, so I won't cover that here; I'll just give you the first step. Run this command from your shell and follow the prompts:

```sh
npm create astro@latest
```

In one step you'll be asked if you want to create a blog. That will get you up and running with a simple blog theme. That's what I started with and it was easy to update until I got to what you see today. Behind the scenes, Astro gathers up information about your content and makes that available within your components. That makes it easy to parse your posts and present them how you see fit. You can sort by date, filter by tag, etc. I added a draft status to the post schema and now those get filtered out when deploying. You can take your content and build something great around it.

I moved all of my old posts over to the new site and it was mostly painless. The biggest chore was updating the [frontmatter](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout) properties to match the new schema keys. That and updating links where necessary. Overall, it was very straightforward.

## Styles

I took inspiration from the [Gokarna](https://github.com/526avijitgupta/gokarna) theme that I used with Hugo and the [Astro Paper](https://github.com/satnaing/astro-paper) theme. I used a bit of custom CSS, but I wanted to use a utility CSS framework to make things quicker. If you look at the classes used on this page in DevTools, you'll notice what looks a lot like Tailwind class names. But check the [package.json](https://github.com/camdecoster/camdecoster.github.io/blob/main/package.json) and you won't see the Tailwind library. That's because I opted to use UnoCSS with the Tailwind/Windi CSS compact preset.

[UnoCSS](https://unocss.dev/) is an "instant atomic CSS engine". UnoCSS allows you to build your own utility classes, use CSS [presets](https://unocss.dev/presets/) (like I did), or a combination of both. UnoCSS also includes the ability to use an [icons](https://unocss.dev/presets/icons) preset, which is what I did for the icons you see used on the site. I used the [Tachyons](https://tachyons.io/) CSS toolkit at Observable, so switching to UnoCSS and Tailwind was simple; I just needed to learn the new class names.

When searching for a font to use, I tried a number of options using the ever useful [Google Fonts](https://fonts.google.com/). Ultimately, I settled on [Jetbrains Mono](https://fonts.google.com/specimen/JetBrains+Mono). That's what I use in VS Code for editing and I've grown to appreciate how easy it is to read.

## Next steps

Making this change has been a lot of fun, so I'm going to keep tinkering and sanding off the rough edges. I'm happy with the results so far, but I'm looking at adding some of the following in the future:

- A copy button on code blocks
- Individual post meta images
- Reading time estimates
- Site search
- A table of contents component
- A light theme
- Move content to headless CMS

If you have any good ideas, or notice any bugs, let me know [here](https://github.com/camdecoster/camdecoster.github.io/issues/new).

## Conclusion

As part of the new version of the site, I've switched it to a new domain: [camdecoster.dev](https://camdecoster.dev/). I'm still hosting it on GitHub Pages, but I think this looks better (and it's less to type). It was actually a lot easier than I imagined and I wish I had done it sooner. I'll remember that for the future.

All of these changes will hopefully lead to me posting a bit more. I like writing things down, but sometimes it feels like quite a chore. The new site (and all the underlying tooling) should make content creation easier, so I'll set a goal of writing one post per month in 2024. That seems reasonable and attainable. Thanks for reading and good luck in the new year!