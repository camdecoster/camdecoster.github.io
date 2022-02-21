---
title: "Calculate the Zoom Transform Between Two Scales in D3"
description: "Determine the zoom transform to go between two scales in the data visualization library D3"
date: 2022-01-08
tags: ["devblog", "javascript", "d3", "zoom", "scale"]
image: "/posts/calculate-the-zoom-transform-between-two-scales-in-d3/images/header.png"
type: post
---

![gradient from purple to red with caption transforming d3 scales](/posts/calculate-the-zoom-transform-between-two-scales-in-d3/images/header.png "Transforming D3 Scales")

[D3](https://github.com/d3/d3) (data-driven documents) is a JavaScript library for creating and interacting with data visualizations. Think of charts, scatter plots, heatmaps, and bubble graphs just to name a few. Anything and everything required to create a data visualization is included in the D3 library. For my day job ([Markit Digital](https://careers.ihsmarkit.com/search.php?searchkeyword=&searchlocation=Boulder%2C+CO++US), come join me!), I develop a number of charting products, including a JavaScript based interactive time-series chart which uses [D3 Scale](https://github.com/d3/d3-scale), [D3 Selection](https://github.com/d3/d3-selection), and [D3 Zoom](https://github.com/d3/d3-zoom). **Scale** helps manage what data should be shown in a visualization using what's called the scale domain. This is the collection of values that the scale should represent. **Scale** also maps that domain to a scale range. This is the collection of values that the input gets scaled to. For example, if you have data with values from 0 to 1000 (the domain) and you want to scale those to have values from 0 to 100, you would set it up as follows:

```javascript
let dataScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 100]);

// Result is 80
console.log(dataScale(800));
```

We use **Scales** to track the bounds of the axes on the chart. Once you set up the axis scales and render, the chart shows a static view of the data. Since the chart is interactive, the scales need to change as a user pans or zooms around the chart. This is where **Selection** and **Zoom** come in. 

When the chart is initialized, the chart DOM element is saved to a selection.

```javascript
// Save the chart DOM element
const chartNode = select('#mychart');
```

This allows you to manipulate the element by, for example, changing the element attributes or classes. In this case, it's necessary to use a selection to apply **Zoom** transformations to the element. Once initialized, the transform is saved to the selection with the values from the identity transform (if the transform is not already defined). The identity transform represents the unzoomed state, with no transform-scale or translations applied:

```javascript
// Initialize the transform
chartNode.call(d3.zoom().on('zoom', zoomFunction));

const { k, x, y } = d3.zoomTransform(chartNode.node());

// Result is 'Scale is 1, X translation is 0, Y translation is 0'
console.log(`Scale is ${k}, X translation is ${x}, Y translation is ${y}`);
```

**Zoom** ties in well with **Scale**. **Zoom** catches zoom events, calculates the new transform, and can be configured to update a scale after a zoom event takes place, using the `rescaleX` and `rescaleY` methods. These methods essentially undo the current transform to get to the original state, and then apply the new transform. In this way, the scale is updated to show the panned/zoomed data on the chart.

```javascript
// Rescale the dataScale during a zoom event
function zoomFunction(event) {
	dataScale = event.transform.rescaleX(dataScale);
}
```

One of the features of the chart is to be able to load a saved chart showing a timeframe in the past. This loads up fine with the scale domain set appropriately, but the `chartNode` is initialized with the identity transform (where the transform-scale and translations are at the defaults: 1, 0, 0). This causes a problem because it creates a situation where a user is not able to pan/zoom into the future, even though the chart is showing a view from the past. Using the data available in the chart, I was able to determine what the scale should look like in the **present**. Now I needed to find a way to determine the transform to go between the present scale (**from** scale) and the currently shown scale (**to** scale). **Zoom** has no utility to do this, so I created my own.

By passing in the two different scales along with the current transform, the function caclulates the proper transform-scale and translation to go from one scale to another, then returns a transform with the new values.

```javascript
function getTransformFromScales(fromScale, toScale, currentTransform = d3.zoomIdentity, scaleAxis = 'x') {
	// Make sure ranges are the same
	const fromRange = fromScale.range();
	const toRange = toScale.range();
	if (!fromRange.every((value, i) => value === toRange[i])) {
		toRange.range(fromRange);
	}

	const fromDomain = fromScale.domain();
	const toDomain = toScale.domain();
	const translation = toScale(fromDomain[0]) - toScale(toDomain[0]);
	const k = (fromDomain[1] - fromDomain[0]) / (toDomain[1] - toDomain[0]);

	// Set correct translations
	const [tX, tY] = scaleAxis === 'x'
		? [translation, currentTransform[scaleAxis]]
		: [currentTransform[scaleAxis], translation];

	return d3.zoomIdentity.translate(tX, tY).scale(k);
}
```

The transform-scale is calculated by comparing the domain lengths of the **from** and **to** scales. The translation is calculated by taking the difference of the **to**-scaled domain start values. Then it's simply a matter of building the new transform based on the zoom identity.

Using this function has provided two immediate benefits:
1. Users can load a chart showing the past and still navigate to the present
1. The newly calculated transform can be saved and used to return the user to the initial view

Additionally, it makes some other calculations easier. For example, the chart can only show a view for which data is available. In other words, you can't see future data (it doesn't exist yet) and you can't see data from before the first data point (it also doesn't exist). The chart therefore restricts panning/zooming at these boundaries. If the user moves out of bounds, the chart will bring them back to the boundary by calculating the transform to get back to the boundary and moving the chart accordingly (using a pleasant rubber band effect).

D3 is a very robust and feature filled library, but I managed to find one dark corner where it didn't provide a native solution. But now I have one and I offer it to you to help in your projects. I've tried to make it general for many use cases. If you have any suggestions on how to update it to make it better, please contact me and let me know.