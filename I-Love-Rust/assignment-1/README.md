**Assignment 1: Word Frequency Counter**

Write a function:
```rust
fn word_frequency(text: &str) -> HashMap<String, u32>
```

**Requirements:**
- Split `text` into lowercase words (strip basic punctuation like `.` `,` `!`)
- Count occurrences into the `HashMap`
- In `main`, call it on a hardcoded multi-line `&str`, then print the **top 3** words by count, descending
- Use at least one iterator chain (`.iter()`, `.map()`, `.filter()`, `.fold()`, etc.) instead of a manual `for` loop with an index
- No `unwrap()` on anything that could realistically fail — handle it or explain why it's safe

**Constraints:**
- Prefer borrowing (`&str`) over cloning unless you genuinely need ownership
- Keep it to one file, roughly 30–40 lines

Time-box yourself to ~15–20 minutes. Say **"next"** when you're ready for the next one.