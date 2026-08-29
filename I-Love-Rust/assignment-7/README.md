**Assignment 7: Custom Iterator**

Define a struct that generates Fibonacci numbers lazily:

```rust
struct Fibonacci {
    curr: u64,
    next: u64,
}
```

**Requirements:**
- Implement `Fibonacci::new() -> Fibonacci` starting at `0, 1`
- Implement the `Iterator` trait for `Fibonacci` (`type Item = u64;` and `fn next(&mut self) -> Option<Self::Item>`) — each call should advance the sequence and return the current value
- Since Fibonacci is infinite, use `.take(n)` when consuming it — don't add artificial bounds inside `next()`
- In `main`: use your `Fibonacci` iterator with a **chain of adapter methods** — e.g. `.take(10).filter(|x| x % 2 == 0).collect::<Vec<u64>>()` — to get the first 10 Fibonacci numbers, then filter to only the even ones, and print them
- Also demonstrate using it in a plain `for` loop with `.take(5)` (since implementing `Iterator` gives you `for` loop support for free — notice that)

**Constraints:**
- No `unwrap()`/`expect()` needed (the `next()` should basically never return `None` here, think about why and just return `Some(...)` always)
- Watch for overflow — `u64` is generous but don't loop forever without `.take()`
- Keep it to one file, ~30–40 lines

Same time-box, ~15–20 minutes.