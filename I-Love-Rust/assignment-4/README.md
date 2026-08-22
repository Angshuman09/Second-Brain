**Assignment 4: Explicit Lifetimes with a Struct**

Define a struct that holds borrowed data instead of owned data:
```rust
struct Excerpt<'a> {
    text: &'a str,
    source: &'a str,
}
```

**Requirements:**
- Implement a method `fn highlight(&self) -> String` that returns something like `"[source]: text"` — this doesn't need extra lifetime annotations, just get the method signature right
- Write a free function:
  ```rust
  fn longest_excerpt<'a>(a: &'a Excerpt, b: &'a Excerpt) -> &'a Excerpt<'a>
  ```
  that returns whichever `Excerpt` has the longer `text` field
- In `main`, create a `String` (owned) in an outer scope, then create an `Excerpt` borrowing from a **substring slice** of it (not the whole string) — use string slicing directly, not `.to_string()`
- Deliberately try creating a scope where one `Excerpt`'s source `String` would be dropped before the `Excerpt` is used, see the compiler error, then fix it by restructuring scope (don't just clone to dodge it — that defeats the point)

**Constraints:**
- No `'static` anywhere — force yourself to reason about real borrow scopes
- Keep it to one file, ~35–45 lines

Same time-box, ~15–20 minutes.