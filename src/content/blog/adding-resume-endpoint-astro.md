---
title: "Adding a resume endpoint in Astro"
description: "Learn how I created an endpoint to display my resume in Astro"
pubDate: 2024-01-04T18:26:13.334Z
tags: [devblog, astro, resume, github, github-pages, pdf, google-drive]
image: "@assets/adding-resume-endpoint-astro/images/header.png"
draft: true
---

![pdf document pointing to astro](@assets/adding-resume-endpoint-astro/images/header.png "Serving PDFs with Astro")

This site serves as an example of the work that I can create and also lists a number of jobs/projects that I've worked on in the past. But you can't send a recruiter a web site and expect them to click through everything. Also, applicant tracking systems probably don't crawl a site for content. So I guess resumes are still relevant. That's why I wanted to add an endpoint that serves my resume. Is that possible in Astro? Yes!

## GitHub Pages and SSR

I host this site using GitHub Pages. Pages is a service offered by GitHub to serve static assets directly from a repo, with an optional build step. Per the GitHub documentation:

> GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website.

In other words, you can't server side render (SSR) with Pages. There's no instance of Node (or anything else) running on Pages; it just serves static assets. So a solution needs to take that into account.

## Astro and static file endpoints

I configured Astro to build a static site using templates and components for most of the site, but I wanted to create a custom endpoint that serves a PDF copy of my resume. There's a helpful documentation [section](https://docs.astro.build/en/core-concepts/endpoints/#static-file-endpoints) that covers this, but my misunderstanding of how it works led to a headache. I'll touch more on that below.

Per the documentation:

> To create a custom endpoint, add a `.js` or `.ts` file to the /pages directory. The `.js` or `.ts` extension will be removed during the build process, so the name of the file should include the extension of the data you want to create. For example, `src/pages/data.json.ts` will build a `/data.json` endpoint.

That's simple enough. One of the examples covers my exact use case. I tweaked it to request a copy of my resume.

```ts
import type { APIRoute } from "astro";

const path = "https://docs.google.com/document/d/<doc_id>/export?format=pdf"

export const GET: APIRoute = async () => {
  const response = await fetch(path);
  return new Response(await response.arrayBuffer());
}
```

The code tells Astro to fetch a copy of my resume from Google Docs and serves it from the `/resume` endpoint. When I added this code to my repo, I assumed that I would go to the endpoint and see a redirect or some kind of network request for the resume. But that didn't happen! Just the PDF showed up. Why? Because Astro is building a static site. During the build process, Astro fetches the file and saves it in the build directory. Nothing is rendered server side because there's no server.

# Making it work

I originally titled this endpoint file `resume.ts` so that going to the endpoint `/resume` would serve the PDF. This actually worked locally, but every time I accessed the endpoint on Pages, my browser kept trying to download a binary file with no extension called "resume". This was not ideal! Now here's the headache: every time I tried to fix it, the same thing happened. I thought there was a caching issue or some unknown upset condition.

I hand't yet grasped that Astro fetched the file at build time and then saved it in the build directory. So, all of my solutions were working, but I was focused on something that wasn't a problem (fetching the file) instead of the actual problem: the browser retrieved the binary file served from Pages (with no extension) and didn't know what it was. When this happened, the browser fell back to treating the file as the default content type: `application/octet-stream`. My idea of using a clean endpoint of `/resume` wouldn't work. In the end, I had to change the endpoint to `/resume.pdf` (and the file name to `resume.pdf.ts`). With that change, the browser was able to figure out that it should treat the file as a PDF. You can see it [here](https://camdecoster.dev/resume.pdf). I still don't know why it worked locally without the extension, but working is working!

## Google Docs PDF trick

I wanted to share my resume, but I didn't want to have to keep updating my site every time my resume changed. My first thought was to host a PDF on Google Drive and reference that. Then I could just change that file instead of having to update my site. But I learned about a handy trick with Google Docs (where I wrote my resume): you can share a document with a special URL that will convert the document to a PDF before returning it to the user.

It's described [here](https://support.google.com/a/users/answer/13004062?hl=en#share_PDF_links), but the quick version is that you need to change the share URL from this:

> http:<!-- -->//docs.google.com/document/d/<doc_id>/<span style="color: red">edit?usp=sharing</span>

To this:
> http:<!-- -->//docs.google.com/document/d/<doc_id>/<span style="color: red">export?format=pdf</span>

Using this sharing method, any time Astro builds my site, it will grab the latest version of my resume as a PDF and serve that at the `/resume.pdf` endpoint.

## Alternative solution: using a redirect

Another option to send users toward my resume is to use the `redirect` utility function in Astro. This is [exported](https://docs.astro.build/en/core-concepts/endpoints/#redirects) in the endpoint context and is most useful when using SSR, but it works for static sites too.

```js
export async function GET({ redirect }) => redirect("https://www.mysite.com", 307);
```

During build, Astro creates an HTML file that will redirect a user to the referenced site after a couple of seconds.