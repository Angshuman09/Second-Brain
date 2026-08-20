**Assignment 3: Shape Trait with Generics**

Define a trait:
```rust
trait Shape {
    fn area(&self) -> f64;
    fn perimeter(&self) -> f64;
}
```

**Requirements:**
- Implement `Shape` for two structs: `Circle { radius: f64 }` and `Rectangle { width: f64, height: f64 }`
- Write a generic function `fn describe<T: Shape>(shape: &T) -> String` that returns a formatted string like `"Area: 12.57, Perimeter: 12.57"`
- Separately, write a function `fn total_area(shapes: &[Box<dyn Shape>]) -> f64` that sums areas across a **heterogeneous** collection (mix of circles and rectangles in one `Vec`)
- In `main`, build a `Vec<Box<dyn Shape>>` with at least 3 shapes, print each one's description via `describe` (you'll need to dereference or adjust the call — figure out the signature), then print the total area

**Constraints:**
- No `unwrap()`/`expect()` needed here, but do use `f64::consts::PI` for the circle instead of hardcoding pi
- Think about *why* `describe` needs a generic while `total_area` needs `dyn Shape` — you don't have to write it down, just notice it
- Keep it to one file, ~40–50 lines

Same time-box, ~15–20 minutes.