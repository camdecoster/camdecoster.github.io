---
title: "Sort Git Tags by Date"
description: "A quick tip for sorting your git tags chronologically"
pubDate: 2022-03-24T13:22:18-06:00
tags: [devblog, quick-tip, git, sort, npm]
image: "@assets/images/quick_tip_header.png"
---

![quick tip header](@assets/images/quick_tip_header.png "Quick Tip")

One of the libraries that I develop has a lot of tags. During a sprint, we tag new builds as alpha. At the end, we build a final release which we tag as a beta. When it comes to assigning the version number for this beta, I usually can't remember what version we're on. Thankfully, Git has a simple way to list all of your tags in chronological order:

```shell
git tag --sort=taggerdate
```

This command will print a list to the console like this:

```shell
alpha1
alpha2
beta1
alpha3
alpha4
beta2
```

You can make it even simpler by writing an npm script in **package.json**:

```json
{
	"scripts": {
		"tags": "git tag --sort=taggerdate"
	}
}
```

Then you can call it like this:

```shell
npm run tags
```

This is incredibly useful to me and I hope that it helps you too. 