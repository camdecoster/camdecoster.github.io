---
title: "Mirror Reverse Algorithm"
pubDate: 2020-08-01
description: "Learn about the mirror reverse algorithm that comes up in developer technical interviews"
image: "@assets/mirror-reverse-algorithm/images/alex-lopez-JR1ChBgzJvQ-unsplash.jpg"
tags: [devblog, javascript, algorithm, interview, practice-problem]
---

![mirror over a desk](@assets/mirror-reverse-algorithm/images/alex-lopez-JR1ChBgzJvQ-unsplash.jpg)
Photo by [Alex Lopez](https://unsplash.com/@alex_lopez00) on [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral)

I’ve been going through some practice problems that one is likely to see during a technical interview for a developer position. One that I worked through recently has a problem statement as follows:

Write a function to reverse the order of words in a string in place.

That seems simple enough, except for the last two words, “in place.” That means that you should be mutating the existing array, not creating a new one, which is what I would initially try to do. So how does one do this? Let’s walk through it (using JavaScript).

For this example, assume that the input is the following:
```js
let input = [
    'p', 'e', 'r', 'f', 'e', 'c', 't', ' ',
    'm', 'a', 'k', 'e', 's', ' ',
    'p', 'r', 'a', 'c', 't', 'i', 'c', 'e'
];
```

And we expect the output to be the following:
```js
let output = [
    'p', 'r', 'a', 'c', 't', 'i', 'c', 'e', ' ',
    'm', 'a', 'k', 'e', 's', ' ',
    'p', 'e', 'r', 'f', 'e', 'c', 't'
];
```

## Create the mirror reverse algorithm

The most straightforward approach to this problem is to recognize that you need to reverse the elements in an array. In other words, the first element becomes the last and the last becomes the first, and so on, until all elements have been switched. So let’s create a function to handle this:
```js
function mirrorReverse(input, start, end) {
    while (start < end) {
        let temp = input[start];
        input[start] = input[end];
        input[end] = temp;
        start++;
        end--;
    }
}
```

Here, given an array, input, and start and end locations, the function will switch the elements until it gets to the middle of the start and end locations. Alright, let’s use this algorithm in the actual solution:
```js
function reverseWords(input) {
    // Reverse the whole array
    mirrorReverse(input, 0, input.length - 1);
}
```

So, we’re done, right? Not quite. All we’ve done is reverse the original array, which changed it to the following:
```js
[
    'e', 'c', 'i', 't', 'c', 'a', 'r', 'p', ' ',
    's', 'e', 'k', 'a', 'm', ' ',
    't', 'c', 'e', 'f',  'r', 'e', 'p'
]
```

The words are in the correct positions, but the letters are reversed. If only we had a way to reverse the letters to the correct order… Oh right, we do!

## Create the reverse words solution

Let’s use mirrorReverse again:
```js
function reverseWords(input) {
    // Reverse the whole array
    mirrorReverse(input, 0, input.length - 1);
    // Reverse each word in array
    let start = 0;
    let end;
    for (let i = 0; i < input.length; i++) {
        // Handle end of word in middle of array
        if (input[i] === " ") {
            end = i - 1;
            mirrorReverse(input, start, end);
            start = i + 1;
        }
        // Handle end of word at end of array
        else if (i + 1 === input.length) {
            end = i;
            mirrorReverse(input, start, end);
        }
    }
}
```

As we go through each element in the array, we check to see it’s a space. If it is, we’ve found the end of a word. Then we reverse the word and keep checking. Eventually we reach the end of the array and reverse the last word.

## Conclusion

Ultimately, solving this problem is a two step process:
1. Reverse the whole array
1. Reverse each word in the array

We use mirrorReverse in each step, changing the start and end locations to achieve our objective. Throughout this process, we’re passing the pointer to the array as a function argument, so the original array is changed as we work through the algorithm, thereby abiding by the restriction of “in place.” I’m sure that the solution could be improved or made more elegant, but this one works. I should note that there are edge cases that this won’t handle: space at the beginning, space at the end, etc.

If you create a better solution, let me know in the comments.