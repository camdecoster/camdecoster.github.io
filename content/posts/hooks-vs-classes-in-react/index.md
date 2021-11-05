---
title: "Hooks vs. Classes in React"
date: 2020-05-13
description: "Learn about using Hooks instead of Classes in React for creating components"
image: "/posts/hooks-vs-classes-in-react/images/expense-tracker-wip.png"
tags: ["devblog", "react", "hooks", "state"]
type: post
weight: 20
---

I’m working on building a simple expense tracking site, very creatively named Expense Tracker. I’m building it using React for the front-end and Node/Express for the back-end with data being stored in a PostgreSQL database. Here’s a work in progress screenshot:

![work in progress view of expense tracker site](/posts/hooks-vs-classes-in-react/images/expense-tracker-wip.png)

The main function of this site is to show you how much you’ve been spending in easy to read tables. I hadn’t needed to use tables with React before, so I started looking into it and found [React Table](https://react-table.js.org/). It’s easy to use and only required a quick npm package install. But I found out that it uses React Hooks. Here’s an example:
```js
const data = React.useMemo( // <-- What is useMemo? A hook.
    () => [
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
    ],
    []
)
```

## What are Hooks in React?
Simply put, Hooks let you use, or “hook” into, state and other features in functions rather than having to create classes (I’m only going to cover state in this post). Prior to Hooks, function components were sometimes referred to as stateless components because you couldn’t use state in them. Hooks now allow one to use state in functions along with other features. Here’s an [introduction](https://reactjs.org/docs/hooks-intro.html) to them with more details. For me, using Hooks is a simpler way to create React components without having to complicate your app with class specific code. Here’s a class component for a simple button component that toggles between two values using a variable stored in state:

{{< gist camdecoster 795c10b2addc4112c3fb9b6a465c0947 >}}
Class example of ToggleButton component

Here’s a function component with a Hook that provides the same component:
{{< gist camdecoster 7b9962a8b905e3c1a131681344dee71e >}}

Hook example of ToggleButton component

## Declaring State Variables
To declare a state variable with hooks, you simply use the useState hook and pass an initial value as an argument (which no longer has to be an object). It will return a state variable which stores the value (buttonText) and a function to update the value (setButtonText).
const [buttonText, setButtonText] = useState('val1');
This is much simpler than using a class component:
```js
constructor(props) {
    super(props);
    this.state = {
        buttonText: "val1",
    };
}
```

## Reading State Variables
With Hooks, the value of a state variable can be accessed just by reading it like any other variable.
```js
console.log(buttonText);
```

Again, it’s simpler than the equivalent with class components:
```js
console.log(this.state.buttonText);
```

## Updating State Variables
Updating the value of a state variable with Hooks is as simple as calling the update function from the initial declaration:
```js
setButtonText('newVal');
```

Compared to the more complicated way using class components:
```js
this.setState({ buttonText: 'newVal' });
```

## Using Multiple State Variables
To store multiple values in state, call useState multiple times:
```js
const [num1, setNum1] = useState(1);
const [num2, setNum2] = useState(2);
```

To store multiple values at once, use an array or object:
```js
const [arr, setArr] = useState([1, 2, 3]);
const [obj, setObj] = useState({
    val1: 1,
    val2: 2,
});
```

## Recap
Hooks are a new way in React to write function components that can tap into features previously reserved for class components. The most visible of these is adding state using the useState hook. Using hooks can help simplify your code and make it easier to manage. There are other useful hooks that more or less replace the React class component lifecycle, and others that are brand new. You can also create your own custom hooks, so you’re not stuck with the standard functions. Hooks are relatively new, so start playing around with them and see what you can accomplish.







