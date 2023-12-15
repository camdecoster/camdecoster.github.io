---
title: "How to Deploy a Hugo Blog to GitHub Pages"
pubDate: 2021-10-25T13:21:58-06:00
description: "Simplify the Hugo deployment process to GitHub Pages"
tags: [devblog, hugo, blog, github, pages, deploy]
image: "@assets/how-to-deploy-a-hugo-blog-to-github-pages/images/hugo-github.png"
---

![hugo logo with github reference](@assets/how-to-deploy-a-hugo-blog-to-github-pages/images/hugo-github.png)

Well, it's been a while since my last post. Also, that last post was on Medium. I've decided to try building my own blog using [Hugo](https://gohugo.io/) and [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages). Hugo is a static site generator built using Golang which results in very fast builds. Not that I'm taxing it with my blog, but it seems pretty quick.

I decided to switch from Medium to Hugo because it was a new puzzle. I also like the idea of being able to tweak everything under the hood or change the theme (I'm using one called [Gokarna](https://github.com/526avijitgupta/gokarna) for now, but I'll be looking at making a custom one in the future). Getting my content off of Medium was mostly a copy-paste operation. The big difference is that Hugo uses markdown to generate content instead of Medium's WYSIWYG presentation. But I like markdown and its flexibililty, so that's a win for me. Getting the images to show up correctly took some minor sleuthing, but overall it was very staightforward. I'm not going into how to set up Hugo. Just check out the Hugo [docs](https://gohugo.io/documentation/). They helped me figure everything out. 

The head scratching part for me always comes back to GitHub Pages. I can never get the configuration correct the first time. It all comes down to pointing Pages to the correct source. Pages is limited in this sense, but it's free, so I can't complain too much. You have to choose the correct branch and then you have to choose the correct folder within the branch. But your options are restricted. You can choose whichever branch you want, but you can only choose the root of the branch or the /docs folder.

## What I'd like to do:

- Create a repo for my blog that contains all of the source files Hugo needs along with my posts
- Build the site from that source and save it as part of the repo
- Serve the site from the build location

I can do all of that except for the last step. I'd like to be able to point Pages to serve the site from the folder that I choose, but that's not possible right now. Thankfully, there's an npm package I've used in the past that takes care of everything for me. It's called [gh-pages](https://www.npmjs.com/package/gh-pages) and it makes the process simple.

## Publish to GitHub Pages

1. Create a package.json file for your project if you don't already have one. I had to create a new one since Hugo doesn't need/create it by default.
1. Add an npm script to build the site. You can choose a folder other than the default of public, but I'm sticking with the default.
    ```json
    {
        "scripts": {
            "build": "hugo -D"
        }
    }
    ```
1. Install gh-pages to your project as a dev dependency. 
    ```
    npm i gh-pages -D
    ```
1. Add an npm script to deploy the site along with a pre deploy script to build the site. This assumes that you're using the public folder for building your site.
    ```json
    {
        "scripts": {
            "build": "hugo -D",
            "predeploy": "npm run build",
            "deploy": "gh-pages -d public"
        }
    }
    ```
1. Add the public folder to your .gitignore folder, along with any dependency folders. You won't need to include the built site here because you're including it in a different branch.
    ```
    ...
    # dependencies
    /node_modules
    /.pnp
    .pnp.js

    # production
    /public
    ...
    ```
1. Deploy your site to Pages using the deploy script:
    ```
    npm run deploy
    ```
1. Configure GitHub Pages to serve your site from the proper source.

    ![github pages settings](@assets/how-to-deploy-a-hugo-blog-to-github-pages/images/github-pages-settings.png)

## What's Happening?

During deployment, gh-pages creates a new branch in your repo (gh-pages by default) and copies your built site to that branch. It then pushes that branch to GitHub. In the last step, you tell GitHub to use the root of the new branch as the source to serve your site from. In my case, that's [https://camdecoster.github.io/](https://camdecoster.github.io/). Now your site is available to the public and any time you want to update it, you just have to run the deploy script after adding your new content.

## Final Thoughts

I wrote this post mostly to help me remember what to do in the future, since I can't seem to remember all of the proper steps. But it's pretty straightforward when you think about it: create your site, build it, deploy the site to the root of a new branch, configure GitHub. I'm liking Hugo so far and I like being in control of my site and content. I'll be trying to post more often, but work and family take up most of my time, so we'll see how often that really is. Connect with me if you have any feedback.