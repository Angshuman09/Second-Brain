## *Day-4*

## ==**Fundamental**==

Every database fundamentally does **two things**:

1. **Store data** (Write)
    
2. **Retrieve data later** (Read)
    

## ==**Storage engine**==

A **storage engine** is the **internal component of the database that manages how data is stored and retrieved from disk**.

Example:

Different databases use different storage engines.

Example engines:

- **InnoDB** in MySQL
    
- **RocksDB**
    
- **WiredTiger** in MongoDB
    

As an **application developer**, you usually don't implement them, but you must:

- choose the right one
    
- understand performance tradeoffs
    

## ==**Two man families of Storage engine**==

All modern storage engines mostly fall into two families:

### 1. Log-Structured Storage Engines

### 2. Page-Oriented Storage Engines (B-Trees)

These two designs dominate databases.

| Storage Engine Type<br> | Used By<br>                 |
| ----------------------- | --------------------------- |
| Log Structured<br>      | Cassandra, LevelDB, RocksDB |
| B-Tree                  | MySQL InnoDB, PostgreSQL    |

You will see these **everywhere in system design interviews**.

# ==Log-Structured Storage== (Important Concept)

Core idea: Instead of modifying data **in place**, we **append new data to a log**.

Example:

```
SET name = "Angshu"
SET age = 21  
SET city = "Delhi"
```

Instead of updating old data, database writes:
```
1: name=Angshu  
2: age=21  
3: city=Delhi
```

Just **append new records**.

This is called **append-only log**.

### Why this is good

1. Disk writes are fastest when writing **sequentially**. 
2. Appending is **much faster** than random writes.

#  ==The Problem with Logs== (Important)

If we keep appending forever:

```
name = Angshu  
name = Angshuman  
name = Angshu K
```

1. Old values still exist.
2. File becomes huge.

Solution:
### Log Compaction

Database periodically cleans old data:

```
name = Angshu K  
age = 21  
city = Delhi
```

Only latest values remain.

#  ==Indexes==(EXTREMELY IMPORTANT)

Without an index, the database must **scan the entire file**.

Example:

You search:

```
GET name
```

Database would need to scan:

```
name=Angshu  
age=21  
city=Delhi  
...
```

Instead we build an **index**.

Index stores:

```
name → position 1023  
age → position 2045

```
Then database jumps directly to the location.

Index = **data structure that speeds up lookup**.

#  ==Hash Index== (Important)

A **hash table** can be used as an index.

Example:
```
HashMap:  

name → 1045  
age → 2001
```
Then lookup becomes **O(1)**.

But hash indexes have limitations:

- only support **exact lookups**
    
- cannot do **range queries**
    

Example:

This works:

```
GET name
```

But this doesn't work well:

```
age > 20
```


#  ==B-Trees== (SUPER IMPORTANT)

Most relational databases use **B-Trees**.

Example databases:

- PostgreSQL
    
- MySQL
    
- SQLite
    

B-Tree is a **balanced tree** that keeps data sorted.

Example:

```
          50  
        /    \  
      20      80  
     /  \    /  \  
    10  30  60  90
```

Advantages:

- Fast lookup
    
- Fast insertion
    
- Supports **range queries**
    

Example queries:

```
age > 20  
age BETWEEN 20 AND 40  
ORDER BY age

```
This is why relational databases love B-Trees.


# ==Difference Between Log-Structured vs B-Tree==

Memorize this table.

|Feature|Log Structured|B-Tree|
|---|---|---|
|Write Speed|Very fast|Slower|
|Read Speed|Good but depends on compaction|Very good|
|Update|Append|Modify pages|
|Disk Access|Sequential|Random|
|Used In|Cassandra, RocksDB|MySQL, PostgreSQL|

---

# ==Transaction vs Analytics== (Important Later)

Later in the chapter the book explains:

Two database workloads:
### *OLTP*

Online Transaction Processing

Example:

- banking
    
- orders
    
- payments
    

Needs:

- fast writes
    
- fast single record reads
    

---

### *OLAP*

Online Analytical Processing

Example:

- analytics
    
- reports
    
- dashboards
    

Needs:

- scanning huge data
    
- aggregations
    

Example:

```
average sales in 2025
```

Different storage engines optimize for these workloads.

# ==**Data Structures That Power Your Database**==

### Append-Only Log (VERY IMPORTANT)

Look at what `db_set` does:

```
echo "$1,$2" >> database
```

`>>` means **append to the end of the file**.

So every write simply **adds a new line**.

Example database file:
```
123456,London  
42,San Francisco  
42,Exploratorium
```
Notice:

The key `42` appears **multiple times**.

Why?

Because **updates are not overwritten**.

Instead:

old value stays  
new value is appended

This is called:

### **Append-Only Log**

Definition you should remember:

> A log is an **append-only sequence of records**.

Important:  
A log **does not mean application logs**.

It means:

record1  
record2  
record3  
record4

Just a **continuous stream of writes**.

Many real databases use this idea.

# ==Why Append is Fast== (Important Insight)

Disk operations are of two types:

### Sequential write

Write at the **end of file**

```
AAAAAAA -> append here
```

### Random write

Modify somewhere in the middle

```
AAAXAAA
```

Sequential writes are **much faster**.

That's why many databases prefer:

```
append  
append  
append
```

instead of modifying data.

This idea later becomes: **Log Structured Storage**

#  The Big Problem: ==Reads Become Slow== (VERY IMPORTANT)

The `db_get` function does this:

```
grep "^$1," database
```

Meaning:

Search the **entire file**.

Example:
```
123456,London  
42,San Francisco  
42,Exploratorium
```

To find key `42`, the program must scan:
```
line1  
line2  
line3
```

If database has:

1 million records

It must scan **all 1 million lines**.

---

>From the book: Our db_get function has terrible performance if you have a large number of records in your database. Every time you want to look up a key, db_get has to scan the entire database file from beginning to end, looking for occurrences of the key. In algorithmic terms, the cost of a lookup is O(n): if you double the number of records n in your database, a lookup takes twice as long. That’s not good.

### Complexity

This is:

O(n)

Meaning:

|Records|Time|
|---|---|
|100|fast|
|10,000|slower|
|1,000,000|very slow|

Doubling the data → doubles search time.

That is **not scalable**.

# The Solution: ==Index== (EXTREMELY IMPORTANT)

To fix slow reads we add:

### **Index**

Definition you must remember:

> An index is a data structure that helps locate data quickly.

Example:

Instead of searching whole file:

```
database file
```

We maintain a separate structure:

```
index
```

Example:

```
42 -> position 205  
123456 -> position 1
```

Now lookup works like:

```
Step 1: find key in index  
Step 2: jump to file location
```

No full scan needed.

#  ==What Is an Index Really?==

Think of a **book index**.

At the back of a book:

```
database -> page 45  
log -> page 10  
storage -> page 30
```

You don't read the whole book. You jump to the page. Databases use the same idea.

# ==Index Is Extra Data== (Important)

Key idea:

Index **does not store the main data**.

It stores **metadata about the data**.

Example:

Main data:

```
42,San Francisco
```

Index:

```
42 -> byte 2401
```

So index is a **pointer system**.

---

# 8️⃣ ==Index Tradeoff== (SUPER IMPORTANT)

This is a **core system design concept**.

Indexes improve:

```
READ SPEED
```

But hurt:

```
WRITE SPEED
```

Why?

Because when you insert data:

You must update:

1️⃣ data file  
2️⃣ index

More indexes = more work.

---

### Example

If a table has 5 indexes:

Every write must update:

```
data  
index1  
index2  
index3  
index4  
index5
```

So writes become slower.

> Well-chosen indexes speed up reads, but every index slows down writes.

# ==Why Databases Don't Index Everything==

Because indexes cost:

- CPU
    
- memory
    
- disk
    
- write performance
    

So databases like:

- PostgreSQL
    
- MySQL
    

let **developers choose indexes manually**.

Example:

```
CREATE INDEX idx_user_email
```

You only index **frequently queried fields**.

---

# ==**Hash Index(most important)**==

We already saw the database log like this:

```
123,London  
42,San Francisco  
42,Exploratorium
```

Problem:  
To find key `42`, we must **scan the whole file**.

Solution:

Use a **hash map as an index**.

Structure:

```
HashMap (in RAM)  
  
123 -> byte 0  
42 -> byte 40
```

Meaning:

- key → **location in the file**
    

That location is called:

### **Byte Offset**

Example:

```
42 -> byte 40
```
Means:

> Start reading the file at byte 40 to get the value.

So lookup becomes:

```
Step 1: find key in hash map  
Step 2: jump directly to file offset  
Step 3: read value
```

This makes lookup **O(1)** instead of **O(n)**.

# ==Real Database That Uses This Idea==

A real storage engine that works like this is:

- **Bitcask** used in Riak.
    

Architecture:

```
Disk  
 └── append-only log (values)  
  
RAM  
 └── hash map (key → file offset)
```

Important rule:

> **All keys must fit in RAM.**

Values can be huge because they stay on disk.

# ==Why This Is Very Fast==

Reads:

```
hash map lookup → jump to disk
```

Only **one disk seek**.

Sometimes even **0 disk reads** if data is cached.

Writes:

```
append to log  
update hash map
```

Both are very fast.

So this design gives:

|Operation|Speed|
|---|---|
|Write|Very fast|
|Read|Very fast|

---

# ==Real-World Use Case==

The book gives example:

```
cat video URL -> play count
```

Example:

```
youtube.com/cat123 -> 5
```

Each time someone clicks:

```
youtube.com/cat123 -> 6  
youtube.com/cat123 -> 7  
youtube.com/cat123 -> 8
```

Updates happen **many times per key**.

But number of keys is **small enough to fit in RAM**.

Perfect for **hash index design**.

---

# ==The Disk Space Problem==

Since we **never overwrite**, the file grows forever.

Example:

```
cat1 -> 1  
cat1 -> 2  
cat1 -> 3  
cat1 -> 4
```

Old values remain.

Solution:

### **Segment the log**

Instead of one huge file:

```
segment1.log  
segment2.log  
segment3.log
```

When file reaches size limit:

```
close segment  
create new segment
```

# ==Compaction== (VERY IMPORTANT)

Compaction removes old values.

Example log:
```
cat1 -> 1  
cat2 -> 4  
cat1 -> 2  
cat1 -> 3
```

After compaction:

```
cat1 -> 3  
cat2 -> 4
```

Only **latest values remain**.

---

# ==Segment Merging==

During compaction, segments are also merged.

Example:

Before:

```
segment1  
segment2  
segment3
```

After merging:

```
segment_merged
```

Important:

Old segments are **immutable** (never modified).

So merging creates **a new file**.

Then database switches to the new file.

Old ones are deleted.

This happens **in background threads**.

So database **never stops serving requests**.

---

## *Day-5*

