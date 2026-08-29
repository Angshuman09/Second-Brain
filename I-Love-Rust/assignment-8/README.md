**Assignment 8: Threads with Arc<Mutex<T>>**

Write a program that spawns multiple threads to increment a shared counter:

```rust
use std::sync::{Arc, Mutex};
use std::thread;
```

**Requirements:**
- Create a `counter: Arc<Mutex<i32>>` starting at `0`
- Spawn **5 threads**, each cloning the `Arc` and incrementing the counter **100 times** inside a loop
- Use `.join()` on all thread handles (collect them into a `Vec<JoinHandle<()>>` first) before reading the final value
- Print the final counter value and confirm it equals `500`
- Separately, use `std::sync::mpsc::channel` to have one spawned thread **send** a computed value (e.g. sum of 1..=10) back to `main`, which **receives** it and prints it

**Constraints:**
- No `unwrap()` on the `.lock()` call inside the loop — handle the `PoisonError` case explicitly (even if just by matching and printing, don't just `.unwrap()` it away)
- Think about *why* you need `Arc` instead of `Rc` here, and `Mutex` instead of `RefCell` — don't write it down, just notice it
- Keep it to one file, ~40–50 lines

Same time-box, ~15–20 minutes.