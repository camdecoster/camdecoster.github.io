# camdecoster.github.io

This is the personal blog for Cameron DeCoster. I use it to keep track of solutions to problems that I encounter as a Software Engineer. I occasionally add my thoughts on life, though that's usually related to something technical. This document is more to help me remember how to add to the blog than to detail instructions for anyone else. If you're not me, I hope you can learn something useful. If I'm doing something wrong/poorly, please file an [issue](https://github.com/camdecoster/camdecoster.github.io/issues/new).

## Creating a new post

To create a new post, use the following command:

```
hugo new posts/name-of-post/index.md
```

## Previewing locally

Hugo will generate a preview on a local development server very quickly. To start it up, enter the following command.

```
npm run dev
```

## Deploying updates

Updates are deployed automatically using a custom [Hugo GitHub Action](https://gohugo.io/hosting-and-deployment/hosting-on-github/). Previously, updates relied on the **gh-pages** package library to handle this. You can read about that solution [here](https://camdecoster.github.io/posts/how-to-deploy-a-hugo-blog-to-github-pages/).

## Built with

- [Hugo](https://gohugo.io/)
- [Gokarna Theme](https://github.com/526avijitgupta/gokarna)
