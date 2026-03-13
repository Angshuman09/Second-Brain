In a **B-Tree**, data is stored in **fixed-size pages** (for example 4KB or 8KB blocks on disk).

When something changes (insert/update/delete):

- The database **reads the page**
    
- **modifies it in memory**
    
- then **writes the same page back to the same location on disk**
    

Example:

```
Disk Page 42  
[ key1 | key2 | key3 ]
```

Insert `key4` → database modifies the page:

```
Disk Page 42  
[ key1 | key2 | key3 | key4 ]
```

Then it **overwrites Page 42** on disk.

So the **file location stays the same**.

This is called **in-place update**.