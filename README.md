# camdecoster.dev

This is repo for the personal [blog](https://camdecoster.dev/) of Cameron DeCoster. I use it to keep track of solutions to problems that I encounter as a Software Engineer. I occasionally add my thoughts on life, though that's usually related to something technical. This document is more to help me remember how to add to the blog than to detail instructions for anyone else. If you're not me, I hope you can learn something useful. If I'm doing something wrong/poorly, please file an [issue](https://github.com/camdecoster/camdecoster.github.io/issues/new).

## Built with

- [Astro](https://astro.build/)
- [UnoCSS](https://unocss.dev/)

## Creating a new post

To create a new post, enter the following command with whatever title you'd like:

```sh
npm run draft "Title of Post"
```

This will create a draft post using [this](https://github.com/camdecoster/camdecoster.github.io/blob/main/src/utils/createNewDraft.js) template. The post slug will be generated using the title you provide.

## Previewing locally

Astro will generate a preview on a local development server very quickly. To start it up, enter the following command.

```
npm run dev
```

## Deploying updates

Updates are deployed automatically using a custom [Astro GitHub Action](https://docs.astro.build/en/guides/deploy/github/). Previously, updates relied on the **gh-pages** package library to handle this. You can read about that solution [here](https://camdecoster.dev/posts/how-to-deploy-a-hugo-blog-to-github-pages/).