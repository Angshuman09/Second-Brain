**Assignment 6: Shared Mutable State with Rc<RefCell<T>>**

Model a simple shared counter used by multiple "owners":

```rust
struct Account {
    balance: Rc<RefCell<f64>>,
}
```

**Requirements:**
- Implement `Account::new(initial: f64) -> Account`
- Implement `fn deposit(&self, amount: f64)` and `fn withdraw(&self, amount: f64) -> Result<(), String>` (withdraw should fail with an error message if funds are insufficient — no `unwrap()`)
- Implement `fn clone_handle(&self) -> Account` that returns a *new* `Account` sharing the **same underlying balance** (i.e., clone the `Rc`, not the value)
- In `main`: create one `Account`, clone a handle from it, deposit through the original, withdraw through the clone, and print the balance from *both* handles afterward to prove they see the same state
- Deliberately trigger a `RefCell` borrow panic on purpose (e.g. hold a `.borrow()` while trying `.borrow_mut()` in the same scope), observe it, then comment it out or restructure to fix it

**Constraints:**
- No `unwrap()` in `deposit`/`withdraw` logic — use `.borrow()`/`.borrow_mut()` deliberately and think about scope
- Keep it to one file, ~40–50 lines

Same time-box, ~15–20 minutes.