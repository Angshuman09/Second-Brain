
Now imagine the page becomes full.

Example page capacity:

```
Page can store 4 keys
```

Current page:

```
Page 7  
10  
20  
30  
40
```

Now insert **25**.

There is **no space**.

---

# 4. What B-tree does (Page Split)

The page is split into two pages.

Before:

```
Parent  
  |  
Page 7  
10 20 30 40
```

After split:

```
      Parent  
	  /     \  
  PageA     PageB  
  
PageA: 10 20  
PageB: 30 40

```
Now insert **25** into PageA.

But notice something important:
We must update **multiple pages**.

Steps:

```
1. Create PageA  
2. Create PageB  
3. Update parent page to point to them
```

So **3 pages must be written to disk**.

---

# 5. The Crash Problem

Imagine the database crashes during these writes.

Possible scenario:

```
PageA written ✔  
PageB written ✔  
Parent page NOT updated ✘
```

Now the parent still points to the **old page**.

Result:

```
PageA and PageB exist  
but nothing references them
```

This is called:

```
Orphan pages
```

Another bad scenario:

```
Parent updated  
but child pages not written
```

Now the parent points to **non-existing pages**.

This creates:

```
Broken references
```

The tree structure becomes **corrupted**.