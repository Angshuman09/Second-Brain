**Assignment 2: Parsing with Custom Errors**

Write a function:
```rust
fn parse_and_divide(a: &str, b: &str) -> Result<f64, DivError>
```

**Requirements:**
- Define your own `enum DivError` with at least two variants: one for a parse failure, one for division by zero
- Implement `std::fmt::Display` for `DivError` (manually, no external crates)
- Inside the function, parse both `a` and `b` as `f64` using the `?` operator — this means you'll need a `From<ParseFloatError> for DivError` impl (or `.map_err()`, your choice, but try `From` + `?` first since that's the muscle you want)
- Return the division result, erroring out cleanly if `b` parses to `0.0`
- In `main`, call it with 3–4 test pairs (some valid, some bad input, one divide-by-zero) and print either the `Ok` value or the error message

**Constraints:**
- No `unwrap()` or `expect()` in the function body itself
- Keep it to one file, ~35–45 lines

Same time-box, ~15–20 minutes.