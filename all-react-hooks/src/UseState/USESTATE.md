# React `useState` hook

This README explains how `useState` works internally, why state updates feel asynchronous, and when to use functional updates (`prev => ...`).

---

#  What is `useState`?

`useState` is a React Hook that lets you add state to functional components.

```ts
const [value, setValue] = useState<number>(0);
```

* `value` → current state
* `setValue` → function to update state

---

#  How State Updates Actually Work

State updates in React are:

* asynchronous
* batched
* applied on next render

Example:

```ts
const handleClick = () => {
  setValue(value + 1);
  console.log(value);
};
```

Output:

```
old value
```

Why?

Because React schedules the update and re-renders later.

Sequence:

1. handler runs
2. state update scheduled
3. function continues
4. render happens
5. UI updates

---

#  Functional Updates (`prev =>`)

Correct pattern when new state depends on old state:

```ts
setValue(prev => prev + 1);
```

Why this exists:

React may batch multiple updates before render.

---

#  Stale State Problem

Wrong:

```ts
setValue(value + 1);
setValue(value + 1);
setValue(value + 1);
```

Result:

```
+1 only
```

Because all calls use same stale value.

---

#  Functional Updates Fix It

```ts
setValue(prev => prev + 1);
setValue(prev => prev + 1);
setValue(prev => prev + 1);
```

Result:

```
+3
```

React applies sequentially:

```
prev=0 → 1
prev=1 → 2
prev=2 → 3
```

---

#  Mutating State Variable

Avoid:

```ts
value += 1
value++
```

State should be treated as immutable.

Correct:

```ts
setValue(value + 1)
setValue(prev => prev + 1)
```

---

#  Why `console.log` Shows Old Value

```ts
setValue(prev => prev + 1);
console.log(value);
```

Logs old state because render hasn’t happened yet.

To observe updated value:

```ts
useEffect(() => {
  console.log(value);
}, [value]);
```

---

#  Mental Model

Think of `setState` like a request:

```
setValue → "please update"
React → "will update after this function"
```

State changes only on next render.

---

#  When to Use Functional Updates

Use `prev =>` whenever:

* incrementing counters
* toggling booleans
* updating arrays/objects from previous state
* multiple updates in same event
* async updates (timeouts, promises, effects)

---

# 🏁 Best Practice Summary

✔ Prefer functional updates when depending on previous state
✔ Never mutate state variables
✔ Don’t expect immediate state change
✔ Use `useEffect` to observe updates

---

#  Example Component

```tsx
import { useState, useEffect } from "react";

export default function Counter() {
  const [value, setValue] = useState(0);

  const increment = () => {
    setValue(prev => prev + 1);
  };

  useEffect(() => {
    console.log("Updated:", value);
  }, [value]);

  return (
    <button onClick={increment}>
      Count: {value}
    </button>
  );
}
```

---

#  Key Takeaway

If next state depends on previous state → always use:

```ts
setState(prev => newValue)
```

This guarantees correctness with React’s async and batched rendering model.
