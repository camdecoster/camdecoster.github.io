import { mkdirSync, readdirSync, writeFileSync } from "fs"
import GithubSlugger from "github-slugger";
import { join } from "path";
import { argv, cwd } from "process";

/**
 * This script should be run via npm:
 * npm run draft "This is a title"
 */

const args = argv.slice(2);

if (args.length) {
  const title = args.join(" ");
  const blogPath = join(cwd(), "src", "content", "blog");
  const existingSlugs = readdirSync(blogPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(d => d.name.slice(0, -3));

  const slugger = new GithubSlugger();
  existingSlugs.forEach(es => slugger.slug(es))
  const slug = slugger.slug(title);

  const markdown = `---
title: "${title}"
description: "TBD"
pubDate: ${new Date().toISOString()}
tags: [devblog]
image: "@assets/${slug}/images/header.png"
draft: true
---

![image description](@assets/${slug}/images/header.png "Alt Text")

## This is a draft post.

- Update the description
- Update the tags
- Update the header image
- Add some sweet, sweet content
- Once it's ready for publishing, remove the draft property from the frontmatter section ☝️`;

  const postPath = join(blogPath, slug + ".md");
  writeFileSync(postPath, markdown);
  mkdirSync(join(cwd(), "src", "assets", slug));
  mkdirSync(join(cwd(), "src", "assets", slug, "images"));
  
  console.log(`Post created at ${postPath}`);
} else {
  console.error("ERROR: A title is required for creating a draft")
  console.log('Use the following syntax: npm run draft "This is a title"')
}