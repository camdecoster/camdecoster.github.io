---
title: "Change how a website looks with Stylus and UserCSS"
pubDate: 2020-06-13
updatedDate: 2023-12-14
description: "Customize the styles on any website using Stylus and UserCSS"
image: "@assets/change-how-a-website-looks-with-stylus-and-usercss/images/pocket-casts-dark-blue.png"
tags: [devblog, stylus, css, usercss, pocket-casts, user-styles]
---

![pocket casts site with dark blue theme](@assets/change-how-a-website-looks-with-stylus-and-usercss/images/pocket-casts-dark-blue.png)

When using a website, the way it looks (the way it’s styled) is a result of how the author has set up the [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) rules. These rules describe how the HTML should be displayed to the user in different situations. Most websites do a good job of creating something I find presentable. But sometimes I use a site a lot and start to notice things that bother me. In this case, it was the Pocket Casts web application.

Pocket Casts is a great podcast listening mobile app that also has a web version. It provides a great way to consume podcasts in the background while getting work done. It also syncs listening progress and the podcast queue between devices. I’m a fan.

What I’m not a fan of is the color themes on the web app. It’s either blinding white or black with white text. For me, one is too bright and the other has a contrast that’s too high for my taste. So what’s a user to do? Enter the [Stylus](https://add0n.com/stylus.html) Chrome/Firefox extension.

Stylus allows one to change the CSS of a website and alter how it looks. Simply, Stylus takes alternate CSS code and overwrites the existing code so that the new style shows instead of the old one. It’s very easy to use and can be as simple as going to [userstyles.org](https://userstyles.org/) and installing some new styles ([here’s one](https://userstyles.org/styles/113617/wikipedia-1911-dark) for Wikipedia that I like).

Side note: on Userstyles you’ll see the Stylish extension advertised to use the styles, but don’t install it. Stylish used to be fine but then they started adding tracking code to the extension. Stylus was created as a response and is a fork of the original Stylus code, just without the tracking code.

There are existing Pocket Casts styles available, but none of them hit the right theme, in my opinion. So I made my own. I thought of publishing it on Userstyles, but opted not to. I’ve published styles there before and it’s kind of a pain to get everything set up and then there’s more pain when you need to update the style. Thankfully, Stylus gives users another option: [UserCSS](https://github.com/openstyles/stylus/wiki/Usercss).

From the website: “UserCSS is essentially a CSS stylesheet with some extra data added to the beginning. We add a .user.css extension so you know it’s different.” It also includes self-hosting, user-customizable variables, and preprocessors. I’m taking advantage of the self-hosting feature. Now I’m able to host the style on GitHub and updates I push there will automatically be downloaded to those who have it installed. All the required information is included in the style header. Here’s what it looks like:
```css
/* ==UserStyle==
@name           Pocket Casts Dark Blue
@version        2020.4.14-1
@description    An alternative dark theme for the Pocket Casts web player
@author         camdecoster
@namespace      camdecoster.io
@homepageURL    https://github.com/camdecoster/pocket-casts-dark-blue
@supportURL     https://github.com/camdecoster/pocket-casts-dark-blue/issues
@updateURL      https://raw.githubusercontent.com/camdecoster/pocket-casts-dark-blue/master/pocket-casts-dark-blue.user.css
@license        CC-BY-NC-SA-4.0
==/UserStyle== */
```

Let’s go over what each of these items is:
* `name`: The name of your style
* `version`: The version of your style. When checking for updates, Stylus looks at this number to see if it has increased. I’m using a numbering system based on the date of publishing.
* `description`: The description of the style.
* `author`: Who created the style.
* `namespace`: A label to distinguish this style from others which may have the same name. This may be obsolete now.
* `homepageURL`: A link to the page for the style. In my case, the GitHub repo page.
* `supportURL`: A link for when users need support.
* `updateURL`: A link to the actual CSS file. This will be used during initial installation and on subsequent updates.
* `license`: What license the style is released under.

It’s pretty straightforward, but it allowed me to keep control over the style and made it easy to update. Stylus provides a [guide](https://github.com/openstyles/stylus/wiki/Writing-styles) on how to create your own style and answers most questions you’ll have. I used it a lot when figuring everything out for my Pocket Casts style. Speaking of which, here’s a link to the theme that I created: [Pocket Casts Dark Blue](https://github.com/camdecoster/pocket-casts-dark-blue).

I’m a big fan of Stylus and UserCSS. I like the idea that I can tweak a website to make it look how I want it to. Try playing around with it and see what you can do. There are plenty of examples out there and it’s a good way to learn about CSS selectors and attributes. Let me know if you do.








