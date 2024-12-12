---
title: "Convert JavaScript Object to String"
description: "For use in Markdown files, documents, etc."
pubDate: 2022-03-11T08:20:03-07:00
tags: [devblog, javascript, object, string, markdown, json, json5, concat-md]
image: "@assets/convert-javascript-object-to-string/images/header.png"
---

![batman slapping robin meme: object? string!](@assets/convert-javascript-object-to-string/images/header.png "Take that object!")

At my day job, the styles for one of the charting libraries that I develop are configured by passing in an object. There are lots of options to change (eg. color, line width, line dash, etc.) and it can be a bit much to keep track of without a list. To help guide users, we include a manual page which lists the contents of the styles object with default values. But updating this page requires manually copying the default styles from the DevTools console and pasting it into the manual page. As with any manually performed operation, it gets missed from time to time and the manual gets out of date. This happened again recently, so I decided to finally fix the problem.

My requirements for a solution included the following:

- Include all of the existing manual page content
- Make it automated
- Make it look good

To include all of the existing manual page content, I used a package that combines markdown files, called [concat-md](https://github.com/ozum/concat-md), available on [npm](https://www.npmjs.com/package/concat-md). To make it automated, I used an npm script. I'll get back to these points later, because most of the work involved the last requirement. In order to make it look good, I tried a few different options. Let's assume that this is my styles object:

```javascript
const styles = {
	background: {
		color: 'red'
	},
	color: 'blue',
	lineDash: '4,2',
	width: 3
};
```

Now let's convert it.

## Convert the object to a string:

Input:

```javascript
console.log(styles.toString());
```

Output:

```shell
[object Object]
```

As you can see, that doesn't provide any useful information.

## Convert the object into JSON

Input:

```javascript
console.log(JSON.stringify(styles));
```

Output:

```shell
{"background":{"color":"red"},"color":"blue","lineDash":"4,2","width":3}
```

That's closer, but we've lost all of the formatting that makes it human readable. Thankfully, `JSON.stringify{:js}` has an option to add white space. I like tabs, so we'll use a tab character as the white space.

Input:

```javascript
console.log(JSON.stringify(styles, null, '\t'));
```

Output:

```shell
{
	"background": {
		"color": "red"
	},
	"color": "blue",
	"lineDash": "4,2",
	"width": 3
}
```

Almost there, but I'd prefer not to have quotation marks around the keys. Unfortunately, `JSON.stringify{:js}` has no option to remove the quotation marks. It is JSON after all.

## Convert the object to a string using `util.inspect{:js}`

Node includes a handy utility called `inspect{:js}` that will convert the object into a string, including white space, and skip the quotation marks.

Input:

```javascript
const util = require('util');

console.log(util.inspect(styles));
```

Output:

```shell
{
  background: { color: 'red' },
  color: 'blue',
  lineDash: '4,2',
  width: 3
}
```

This is really close to what I'm looking for, but it uses spaces instead of tabs and there's no way to change that.

## Convert the object into JSON5

In searching for a solution, I discovered a package called [JSON5](https://json5.org/) that describes itself as "JSON for humans". Under it's summary of features, one [item](https://json5.org/#objects) stood out to me:

> - Objects
>	- **Object keys may be an ECMAScript 5.1 IdentifierName.**
>	- Objects may have a single trailing comma.

In short, `JSON5.stringify{:js}` can convert objects to strings without quotation marks around the keys.

Input:

```javascript
const JSON5 = require('json5');

console.log(JSON5.stringify(styles, null, '\t'));
```

Output:

```shell
{
	background: {
		color: 'red',
	},
	color: 'blue',
	lineDash: '4,2',
	width: 3,
}
```

There we go. The only downside I've found is that `JSON5.stringify{:js}` adds trailing commas by default when white space is added. And it doesn't look like there's any way to change that. From the documentation on `JSON5.stringify{:js}`:

> *If white space is used, trailing commas will be used in objects and arrays.*

But that's a minor nag.

## Putting it all together

Now that we have the string version of the object, let's build the manual page. First up, a script to generate the markdown file, which we'll assume is located in the root directory and is titled 'stylesList.md':

```javascript
// buildStylesList.js
const fs = require('fs');
const JSON5 = require('json5');

// These are example styles. Import your own styles in your script.
const styles = {
	background: {
		color: 'red'
	},
	color: 'blue',
	lineDash: '4,2',
	width: 3
};

console.log('Updating the styles list');
fs.writeFile(
	'./stylesList.md',
	'```javascript\n' +
	JSON5.stringify(styles, null, '\n') +
	'\n```',
	err => { if (err) return console.error(err); }
);
console.log('Update complete');
```

Running this script will update 'stylesList.md' to the following:

<!-- Use 4 backticks here to be able to include the 3 backticks in example -->
````markdown
```javascript
{
	background: {
		color: 'red',
	},
	color: 'blue',
	lineDash: '4,2',
	width: 3,
}
```
````

Finally, let's use `concat-md{:js}` to put the styles info and list together. Create a `concat-md{:js}` execution script (assuming that 'styles.md' exists in the root directory):

```javascript
// concatMdFiles.js
const concat = require('concat-md');
const fs = require('fs');

fs.writeFile(
	'./styles.md',
	concatMd.concatMdSync('./'),
	err => { if (err) return console.error(err); }
)
```

Running this script will combine all of the markdown files from the root directory (in alphabetical order) into 'styles.md'. If you generate documentation using the npm script 'doc', you can set this all to run before that with the following additional npm scripts in 'package.json':

```json
{
	"scripts": {
		"buildStylesList": "node ./buildStylesList.js",
		"concatMdFiles": "node ./concatMdFiles.js",
		"predoc": "npm run buildStylesList && npm run concatMdFiles",
		"doc": "esdoc"
	}
}
```

Now the styles list will be built every time documentation is generated, and you won't have to worry about pasting it in yourself. Just make sure you use your actual styles list instead of the example one. Good luck with creating your documentation!