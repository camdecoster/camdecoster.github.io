---
title: "Testing D3 Format Specifiers"
description: "Figuring out how format specifier strings work in D3"
date: 2022-03-29T04:29:27-06:00
tags: ["devblog", "javascript", "d3", "vue", "github", "pages"]
image: "/posts/testing-d3-format-specifiers/images/header.png"
type: post
---

![d3 tester logo](/posts/testing-d3-format-specifiers/images/header.png "D3 Tester")

The D3 library provides a number of modules that can be used to format data, including [d3-format](https://github.com/d3/d3-format) and [d3-time-format](https://github.com/d3/d3-time-format). These are very useful because they can take a JavaScript value and make it more human readable. These two modules work as follows:

1. Provide a value
1. Provide a format specifier
1. The module returns a formatted version of that value based on the format specifier

In my case, I have a configuration option in a project where users can pass in a specifier string which will control how some labels are displayed. But I ran into an issue when adding this logic in: how do I figure out how a format specifier will affect the value? The answer is trial and error, but doing so via configuration files in this project was cumbersome and slow. So I decided to build a tool to give me real-time results: [D3 Tester](https://camdecoster.github.io/d3-tester/).

![d3 format tester screenshot](/posts/testing-d3-format-specifiers/images/d3-format-tester.png "D3 Format Tester")

This site allows users to enter a format specifier and value and see the output right there. It's a simple way to hook into the D3 modules without having to install the library on your own. I built it using the following libraries:

- [D3](https://github.com/d3/d3)
- [CoreUI Bootstrap Vue](https://coreui.io/bootstrap-vue/)
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)

## Getting Routing Working

The trickiest part of this build was getting routing working correctly on GitHub pages. I like using web history for routing with [Vue Router](https://router.vuejs.org/api/#history), but that doesn't work on GitHub pages if you navigate to a page route then reload. So web hash history is necessary in this case. Additionally, you need to set the base url properly when using routing. Here's how my **main.js** file ended up looking:

```javascript
import BootstrapVue from '@coreui/bootstrap-vue';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

// Import styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue';
import routes from './routes.js';

const router = createRouter({
	history: createWebHashHistory(process.env.NODE_ENV === 'production' ? '/d3-tester/' : '/'),
	routes
});

createApp(App)
	.use(BootstrapVue)
	.use(router)
	.mount('#app');
```

## Observable Notebook Version

The D3 library is maintained by the company [Observable](https://observablehq.com/). In addition to maintaining D3, they provide a way to interact with data via "notebooks" on their platform. I was playing around with notebooks recently and was able to recreate D3 Tester. It's less pleasant to look at, but it does have everything in one place and is easy to fork/modify. [Check it out](https://observablehq.com/@camdecoster/d3-tester) if you're interested.