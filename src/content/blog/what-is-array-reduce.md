---
title: "What Is Array Reduce?"
description: "Some examples of how this array method can be useful"
pubDate: 2021-11-13T06:37:56-07:00
tags: [devblog, javascript, array, reduce]
image: "@assets/what-is-array-reduce/images/header.png"
---

![reduce an array from many values to one](@assets/what-is-array-reduce/images/header.png "Reduce an array from many values to one!")

JavaScript has a number of [array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) that can be used to test and manipulate arrays. Most of these are pretty intuitive, but I always have to look at the documentation for the `reduce{:js}` method. Simply put, the reduce method uses a function to return a value from each element of the array and accumulates those values into a single result, *reducing* it to a single value. It's works as follows:

```javascript
const someArray = [5, 10, 15, 20];

// Function adds up all of the elements in an array
const reducerFunction = (total, elementValue) => total + elementValue;

// Result is 50: 5 + 10 + 15 + 20
console.log(someArray.reduce(reducerFunction));
```

The method goes through each element in the array and gets the value, adding it to the total, and finally returns the total at the end. There's an optional second argument that can be passed in to set the intial value of total. If this isn't specified, the first element in the array provides the initial value:

```javascript
// Result is 61: 11 + 5 + 10 + 15 + 20
console.log(someArray.reduce(reducerFunction, 11));
```

The reducer function requires a minimum of two arguments: the accumulator and the current element value. There are two optional arguments: the current index of the array, and a reference to the array itself. These can be useful to use in the reducer function logic, but usually aren't necessary.

This is a straightforward example, but `reduce{:js}` does seem less intuitive than a lot of the other array methods. In fact, I often feel that it would be easier to do the same thing using a loop (and easier to understand).

```javascript
// Set the initial value
let total = 0;

// Add everything up
for (const n of someArray) {
	total += n;
}

// Result is 50: 5 + 10 + 15 + 20
console.log(total);
```

There are some circumstances where it can be nice to have everything together in one tidy declaration, such as checking that all elements have a certain property value:

```javascript
const animals = [
	{ name: 'Cat', pet: true },
	{ name: 'Dog', pet: true },
	{ name: 'Hamster', pet: true }
];


const animalsArePets = animals.reduce(
	(status, a) => status && a.pet, // New value becomes status value and current animal pet value
	true // Set initial value (assume all animals are pets)
);

// Result is true 
console.log(animalsArePets);
```

But it's not perfect, as the reducer function will run on every element, even if it finds an animal that isn't a pet. I do like that it could be written completely on one line.

`reduce{:js}` is a tool that I have in my array toolbox, but it's usually one that I forget how to use. This post will serve as a set of instructions for the future.