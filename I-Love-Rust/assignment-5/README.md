**Assignment 5: Closures and Higher-Order Functions**

Write a function that returns a closure:
```rust
fn make_multiplier(factor: i32) -> impl Fn(i32) -> i32
```

**Requirements:**
- `make_multiplier(3)` should return a closure that triples any `i32` passed to it
- Write a second function:
  ```rust
  fn apply_all(nums: &[i32], f: impl Fn(i32) -> i32) -> Vec<i32>
  ```
  that applies a closure across a slice and collects results — implement this using an iterator chain (`.map().collect()`), not a manual loop
- Write a third function:
  ```rust
  fn make_counter() -> impl FnMut() -> i32
  ```
  that returns a closure which, each time it's called, returns an incrementing count starting at 0 (0, 1, 2, 3...) — you'll need to think about what the closure needs to capture and how (hint: `move`)
- In `main`: use `make_multiplier` + `apply_all` on a `Vec<i32>`, print the result, then call `make_counter()`'s returned closure 4 times in a row and print each value

**Constraints:**
- No `unwrap()`/`expect()` needed
- Think about *why* the third function needs `FnMut` while the first needs plain `Fn` — don't write it down, just notice it
- Keep it to one file, ~30–40 lines

Same time-box, ~15–20 minutes.