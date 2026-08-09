## <span style="color: lightpink;">05 Lecture</span>

Databases are most critical component of any system. They make or break a system.

Data is stored and represented in <span style="color: #FF7F7F; font-weight: bold;">rows</span> and <span style="color: #FF7F7F; font-weight: bold;">columns</span>

### History of relational databases

Everything "revolutionary" starts with Financial applications:

<span style="color: #CBC3E3; font-weight: bold;">Computer first did "<span style="color:#FF7F7F;">accounting</span>" ⟶ ledgers ⟶ rows and columns</span>

![[ledgers.png| here is the simple ledger]]
*This is the simple ledger*

Database were developed to support accounting
Hence key properties were:
1. Data consistency
2. Data durability
3. Data integrity
4. Constraints 
5. Everything in one place

**Because of this reasons, relational databases provides "transactions"?**

![[acid_properties.webp]]

***ACID is a set of four properties that ensure database transactions are reliable and consistent. ACID stands for Atomicity, Consistency, Isolation, and Durability.***

Imagine you are transferring ₹500 from account A to account B.

1. **Atomicity (All or nothing)**
    

The transaction must either complete entirely or not happen at all.

- ₹500 is deducted from account A **and** added to account B.
    
- If the system crashes after deducting money from A but before adding it to B, the entire transaction is rolled back.
    

**Example:**

```
A = 1000
B = 500

Transfer 500

A = 500
B = 1000
```

Either both operations succeed, or neither does.

---

2. **Consistency (Database remains valid)**
    

A transaction should take the database from one valid state to another valid state.

For example:

```
A = 1000
B = 500

Total = 1500
```

After transferring ₹500:

```
A = 500
B = 1000

Total = 1500
```

The total amount remains the same, so the database stays consistent.

---

3. **Isolation (Transactions don't interfere)**
    

Multiple transactions running at the same time should not affect each other.

Suppose:

- Person 1 transfers ₹500.
    
- Person 2 checks the balance simultaneously.
    

Person 2 should either see the old balance or the new balance, but never some half-completed state.

Without isolation:

```
A = 1000

Transaction 1 deducts 500 → A = 500
Transaction 2 reads the balance before B gets updated
```

This can lead to incorrect results.

---

4. **Durability (Data is permanent)**
    

Once a transaction is committed, the data is permanently stored.

Even if the server crashes immediately after the transfer, the changes will not be lost.

Databases achieve this using:

- Transaction logs
    
- Disk storage
    
- Backups
    
- Replication
    

---

### Quick summary

|Property|Meaning|
|---|---|
|Atomicity|All operations succeed or none do|
|Consistency|Database remains valid|
|Isolation|Concurrent transactions don't interfere|
|Durability|Committed data is never lost|

### SQL example

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 500
WHERE id = 1;

UPDATE accounts
SET balance = balance + 500
WHERE id = 2;

COMMIT;
```

If something goes wrong before `COMMIT`, the database executes:

```sql
ROLLBACK;
```

and everything returns to its previous state.

## <span style="color: lightpink;">06 Lecture</span>

## <span style="color:lightblue;">What is an isolation level?</span>

Isolation determines **how one transaction interacts with other transactions running at the same time**.

Imagine two users trying to update the same data simultaneously. Isolation levels define:

- Can Transaction A see Transaction B's changes?
    
- Can Transaction A see uncommitted data?
    
- Can Transaction A get different results from the same query?
    

---

# 1. READ UNCOMMITTED

**Definition:** A transaction can read data that another transaction has modified but **not yet committed**.

### Problem: Dirty Read

**Terminal 1**

```sql
START TRANSACTION;

UPDATE users
SET username = 'alice_new'
WHERE id = 1;
```

**Terminal 2**

```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

START TRANSACTION;

SELECT * FROM users WHERE id = 1;
```

**Output:**

```text
alice_new
```

Now, if Terminal 1 executes:

```sql
ROLLBACK;
```

The change disappears.

![[read-uncommitted.png]]

### Problem

Terminal 2 read data that never actually existed in the database.

### Use cases

- Analytics
    
- Reporting
    
- Logging systems
    

### Disadvantages

- Dirty reads
    
- Inconsistent data
    

---

# 2. READ COMMITTED

**Definition:** A transaction can only see committed data.

### Dirty reads are prevented.

**Terminal 1**

```sql
START TRANSACTION;

UPDATE users
SET username = 'alice_v2'
WHERE id = 1;
```

**Terminal 2**

```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

START TRANSACTION;

SELECT * FROM users WHERE id = 1;
```

**Output:**

```text
alice
```

After Terminal 1 executes:

```sql
COMMIT;
```

Terminal 2 now sees:

```text
alice_v2
```

![[read-committed.png]]
### Use cases

- Social media feeds
    
- Blogs
    
- News websites
    

### Disadvantages

- Non-repeatable reads are still possible.
    

---

# 3. REPEATABLE READ (MySQL default)

**Definition:** A transaction sees the same snapshot of the data throughout its lifetime.

### Problem solved: Non-repeatable read

**Terminal 1**

```sql
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

START TRANSACTION;

SELECT * FROM users WHERE id = 1;
```

Output:

```text
angshu
```

---

**Terminal 2**

```sql
UPDATE users
SET username = 'angshu1'
WHERE id = 1;

COMMIT;
```

---

**Back to Terminal 1**

```sql
SELECT * FROM users WHERE id = 1;
```

Output:

```text
angshu
```

Even though Terminal 2 committed the change, Terminal 1 still sees the old value.

After:

```sql
COMMIT;
```

Terminal 1 sees:

```text
angshu1
```

![[read-repeated.png]]
### Internally

MySQL uses **MVCC (Multi-Version Concurrency Control)**.

Each transaction works on its own snapshot.

### Use cases

- E-commerce inventory
    
- Banking systems
    
- Financial applications
    

### Advantages

- Consistent snapshot
    
- Better concurrency than `SERIALIZABLE`
    

---

# 4. SERIALIZABLE

**Definition:** Transactions behave as if they were executed one after another.

### Example

**Terminal 1**

```sql
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;

START TRANSACTION;

SELECT * FROM users;
```

---

**Terminal 2**

```sql
INSERT INTO users (username)
VALUES ('charlie');
```

Terminal 2 waits until Terminal 1 commits.

![[serializable.png]]
### Use cases

- Banking
    
- Ticket booking systems
    
- Payment systems
    

### Disadvantages

- Slower performance
    
- More locking
    

---

# Common anomalies

## Dirty Read

Reading uncommitted data from another transaction.

```text
T1: UPDATE balance = 1000
T2: READ balance = 1000
T1: ROLLBACK
```

---

## Non-repeatable Read

Reading the same row twice gives different results.

```text
T1: SELECT balance = 500

T2: UPDATE balance = 1000
T2: COMMIT

T1: SELECT balance = 1000
```

---

## Phantom Read

Reading the same query twice returns a different number of rows.

```sql
T1: SELECT COUNT(*) FROM users;
Result = 3

T2: INSERT INTO users VALUES ('david');
COMMIT

T1: SELECT COUNT(*) FROM users;
Result = 4
```

---

# Summary Table

| Isolation Level  | Dirty Read | Non-repeatable Read | Phantom Read |
| ---------------- | ---------- | ------------------- | ------------ |
| READ UNCOMMITTED | Possible   | Possible            |  Possible    |
| READ COMMITTED   | Prevented  | Possible            | Possible     |
| REPEATABLE READ  | Prevented  | Prevented           | Possible     |
| SERIALIZABLE     | Prevented  | Prevented           | Prevented    |

---

# Real-world examples

|Application|Isolation Level|
|---|---|
|Analytics dashboard|READ UNCOMMITTED|
|Social media feed|READ COMMITTED|
|E-commerce inventory|REPEATABLE READ|
|Banking and payments|SERIALIZABLE|

---

# Short notes:

> Higher isolation = more consistency but lower performance.

> Lower isolation = better performance but weaker consistency.

# <span style="color:pink;">Day-7</span>

## <span style="color:lightblue;">Why do we need database scaling?</span>

As the number of users grows, a single database server may struggle with:

- High traffic
    
- Slow queries
    
- Limited storage
    
- Increased latency
    
- Single point of failure
    

To handle this, we scale databases.

---

# 1. Vertical Scaling (Scaling Up)

Vertical scaling means increasing the resources of a single database server.

For example:

- Increase RAM (8 GB → 32 GB)
    
- Add more CPU cores
    
- Use faster SSDs
    
- Upgrade the machine
    

### Advantages

- Easy to implement
    
- No changes in application logic
    
- No data distribution needed
    

### Disadvantages

- Hardware has limits
    
- Expensive
    
- Single point of failure remains
    

---

# 2. Horizontal Scaling (Scaling Out)

Horizontal scaling means adding more servers instead of upgrading one server.

![[horizontal-scalling.png]]
Horizontal scaling improves:

- Availability
    
- Fault tolerance
    
- Performance
    
- Scalability
    

Two common techniques:

- Replication
    
- Sharding
    

---

# 3. Replication

Replication means copying data from one database server to multiple servers.

Usually, there is:

- One primary (leader) database
    
- Multiple replicas (followers)
    

Example:

![[replication.png]]

The primary handles writes, while replicas mainly handle reads.

---

# Benefits of replication

- Faster read performance
    
- High availability
    
- Fault tolerance
    
- Backup and disaster recovery
    

---

# Types of replication

## A. Single-Leader Replication

Only one server accepts writes.

![[single-leader.png]]

### How it works

1. Client sends a write request.
    
2. Primary stores the data.
    
3. Primary sends updates to replicas.
    

### Pros

- Simple
    
- Easy conflict handling
    

### Cons

- Primary is a bottleneck
    
- If the primary fails, failover is needed
    

---

## B. Multi-Leader Replication

Multiple databases can accept writes.

### Pros

- Better write performance
    
- Useful for multiple regions
    

### Cons

- Conflict resolution is difficult
    

Example:

Two users update the same profile from different countries at the same time.

![[multileader.png]]

---

## C. Leaderless Replication

There is no leader.

Any node can accept reads and writes.

![[leaderless.png]]

Examples:

- Cassandra
    
- DynamoDB
    

### Pros

- No single point of failure
    
- Highly available
    

### Cons

- Conflict resolution is complex
    

---

# Synchronous vs Asynchronous Replication

## Synchronous replication

The primary waits for replicas to acknowledge before confirming the write.

![[syncreplication.png]]
### Advantages

- Strong consistency
    

### Disadvantages

- Slower
    

---

## Asynchronous replication

The primary responds immediately and updates replicas later.

![[asyncreplication.png]]
### Advantages

- Faster
    

### Disadvantages

- Replicas may contain stale data
    

---

# Sharding

## What is sharding?

Sharding is a technique used to **horizontally scale** a database by splitting data across multiple databases (called **shards**) instead of storing everything in a single database.

Instead of upgrading a single machine (vertical scaling), we distribute the data among many machines.

```text
Before sharding:

           ┌─────────────┐
           │  Database   │
           │-------------│
           │ users       │
           │ posts       │
           │ comments    │
           └─────────────┘


After sharding:

      ┌─────────┐   ┌─────────┐   ┌─────────┐
      │ Shard 1 │   │ Shard 2 │   │ Shard 3 │
      ├─────────┤   ├─────────┤   ├─────────┤
      │ users   │   │ users   │   │ users   │
      │ posts   │   │ posts   │   │ posts   │
      └─────────┘   └─────────┘   └─────────┘
```

---

# Why do we need sharding?

Vertical scaling has limitations:

- Hardware is expensive.
    
- Storage is limited.
    
- CPU and memory have limits.
    
- Query performance degrades with huge tables.
    
- Database maintenance tasks (VACUUM, indexing, backups) become slower.
    

Sharding solves these problems by distributing data across multiple machines.

---

# Vertical scaling vs Horizontal scaling

## Vertical scaling

Increase the power of a single machine.

```text
2 CPU + 8 GB RAM

        ↓

16 CPU + 64 GB RAM
```

### Advantages

- Easy to implement.
    
- No application changes.
    

### Disadvantages

- Expensive.
    
- Hardware limits.
    
- Single point of failure.
    

---

## Horizontal scaling (Sharding)

Add more machines.

```text
Database 1

        ↓

Database 1 + Database 2 + Database 3
```

### Advantages

- Better scalability.
    
- Better fault tolerance.
    
- Cheaper in the long run.
    

### Disadvantages

- Complex architecture.
    
- Cross-shard queries are difficult.
    
- Distributed transactions are expensive.
    

---

# Important terminology

## Physical database

An actual database server or machine.

Example:

```text
DB-1
DB-2
DB-3
```

---

## Logical shard

A logical partition of data inside a database.

Example:

```text
DB-1

├── schema001
├── schema002
└── schema003
```

Each schema is a logical shard.

---

# Partition key (Shard key)

A partition key determines where data should be stored.

Example:

```text
shard = hash(user_id) % N
```

where:

- `user_id` = partition key
    
- `N` = total number of shards
    

---

Example:

```text
hash(user_1) % 3 = shard_0

hash(user_2) % 3 = shard_1

hash(user_3) % 3 = shard_2
```

---

# Good partition key properties

A good partition key should:

- Distribute data uniformly.
    
- Avoid hotspots.
    
- Keep related data together.
    
- Minimize cross-shard queries.
    
- Scale well.
    

---

Bad partition key:

```text
country = India
```

One shard may become overloaded.

Good partition key:

```text
workspace_id
```

Data is distributed more evenly.

---

# Types of sharding

## 1. Range-based sharding

Partition data based on ranges.

```text
Shard 1: IDs < 1000

Shard 2: IDs 1000–2000

Shard 3: IDs > 2000
```

### Advantages

- Simple.
    

### Disadvantages

- Hotspots may occur.
    

---

## 2. Hash-based sharding

Use a hash function.

```text
shard = hash(user_id) % 4
```

Example:

```text
hash(123) % 4 = shard 3
```

### Advantages

- Uniform distribution.
    

### Disadvantages

- Hard to reshard.
    

---

## 3. Directory-based sharding

Maintain a lookup table.

```text
user_1 → shard_3

user_2 → shard_1

user_3 → shard_2
```

### Advantages

- Flexible.
    

### Disadvantages

- Extra metadata management.
    

---

# Example

Suppose we have four shards:

```text
shard = hash(workspace_id) % 4
```

```text
workspace_1 → shard_0

workspace_2 → shard_1

workspace_3 → shard_2

workspace_4 → shard_3
```

Architecture:

```text
User Request
      │
      ▼

Application
      │
      ▼

hash(workspace_id) % 4
      │
      ▼

Correct shard
```

---

# Application-level sharding

The application decides where the data lives.

```text
Application

workspace_id

      │

hash(workspace_id) % N

      │

Database + shard
```

Example:

```rust
let shard = hash(workspace_id) % 480;
```

The application knows:

```text
workspace_123 → shard_127 → DB-9
```

---

# Cross-shard query problem

Suppose:

```text
User A → shard 1

User B → shard 2
```

Query:

```sql
SELECT *
FROM users
WHERE country = 'India';
```

The query must search every shard.

```text
shard 1

shard 2

shard 3

shard 4
```

This is expensive.

---

# Distributed transaction problem

Suppose:

```text
block → shard 1

comments → shard 2
```

Delete block:

```sql
DELETE FROM block WHERE id = 1;
```

Delete comments:

```sql
DELETE FROM comments WHERE block_id = 1;
```

If one succeeds and the other fails:

```text
block deleted ✅

comments deleted ❌
```

The database becomes inconsistent.

To avoid this, keep related data on the same shard.

---

# Data locality

Store related data together.

Example:

```text
Workspace A

├── blocks
├── comments
├── discussions
└── members
```

All should live in the same shard.

Benefits:

- Faster queries.
    
- Fewer network calls.
    
- Better consistency.
    

---

# Re-sharding

As traffic grows, we may need to add shards.

```text
4 shards

        ↓

8 shards
```

Challenges:

- Moving data.
    
- Updating routing logic.
    
- Avoiding downtime.
    

---

# Migration strategy

### 1. Double write

Write to both old and new databases.

```text
App

├── Monolith
└── Shards
```

---

### 2. Backfill

Copy old data.

```text
Monolith

     ↓

Shards
```

---

### 3. Verification

Ensure data integrity.

```text
Monolith == Shards
```

---

### 4. Dark reads

Read from both databases and compare.

```text
App

├── Monolith
└── Shards
```

Return only the monolith response.

---

### 5. Switch-over

Move all traffic to shards.

```text
Before:

App → Monolith

After:

App → Shards
```

---

# Advantages of sharding

- Horizontal scalability.
    
- Better throughput.
    
- Lower latency.
    
- Better fault isolation.
    
- Handles massive datasets.
    

---

# Disadvantages of sharding

- Complex routing.
    
- Cross-shard joins are expensive.
    
- Harder debugging.
    
- Distributed transactions are difficult.
    
- Re-sharding is expensive.
    

---

# Mental model

Think of a library.

Without sharding:

```text
One giant library.
```

With sharding:

```text
Library 1 → Science books

Library 2 → History books

Library 3 → Literature books
```

Instead of searching the entire city, you know exactly which library to visit.

---
# Partitioning

## What is partitioning?

Partitioning is the process of splitting a large table into smaller, more manageable pieces called **partitions**, while logically treating them as a single table.

The goal is to improve:

- Query performance
    
- Maintenance
    
- Scalability
    
- Data management
    

```text
Without partitioning:

users

┌────────────────────┐
│ id | name | country│
├────────────────────┤
│ ...                │
│ ...                │
│ millions of rows   │
└────────────────────┘
```

```text
With partitioning:

users

├── partition_1
├── partition_2
├── partition_3
└── partition_4
```

From the application's perspective, it's still just one table:

```sql
SELECT * FROM users WHERE id = 100;
```

---

# Why do we need partitioning?

As tables grow, several problems appear:

- Queries become slower.
    
- Indexes become larger.
    
- Backups take longer.
    
- VACUUM and maintenance become expensive.
    
- Deleting old data becomes difficult.
    

Partitioning solves these problems by splitting data into smaller chunks.

---

# Partitioning vs Sharding

|Partitioning|Sharding|
|---|---|
|Splits data within a database|Splits data across multiple databases|
|Usually transparent to the application|Application often manages routing|
|One database server|Multiple database servers|
|Easier to manage|More complex|

### Partitioning

```text
DB-1

users

├── users_2024
├── users_2025
└── users_2026
```

### Sharding

```text
DB-1      DB-2      DB-3

users     users     users
```

**Sharding is horizontal partitioning across multiple databases.**

---

# Types of partitioning

## 1. Range partitioning

Data is partitioned according to ranges.

Example:

```sql
PARTITION BY RANGE (age)
```

```text
Partition 1: age < 18

Partition 2: 18 <= age < 60

Partition 3: age >= 60
```

Example:

```sql
CREATE TABLE users (
    id INT,
    age INT
)
PARTITION BY RANGE (age) (
    PARTITION p1 VALUES LESS THAN (18),
    PARTITION p2 VALUES LESS THAN (60),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);
```

---

### Query example

```sql
SELECT * FROM users WHERE age = 25;
```

PostgreSQL/MySQL only searches:

```text
p2
```

instead of:

```text
p1 + p2 + p3
```

This optimization is called **partition pruning**.

---

## 2. List partitioning

Data is partitioned based on specific values.

Example:

```sql
PARTITION BY LIST (country)
```

```text
p_india    → India

p_usa      → USA

p_other    → Others
```

Example:

```sql
CREATE TABLE users (
    id INT,
    country VARCHAR(20)
)
PARTITION BY LIST (country) (
    PARTITION p_india VALUES IN ('India'),
    PARTITION p_usa VALUES IN ('USA')
);
```

---

## 3. Hash partitioning

A hash function decides the partition.

```sql
partition = hash(user_id) % 4
```

Example:

```text
hash(101) % 4 = partition_1

hash(102) % 4 = partition_2

hash(103) % 4 = partition_3
```

Example:

```sql
CREATE TABLE users (
    id INT
)
PARTITION BY HASH(id)
PARTITIONS 4;
```

---

## 4. Composite partitioning

Use multiple partitioning strategies together.

Example:

```text
Range partition by year

2025
    ├── hash_1
    ├── hash_2
    └── hash_3
```

This is useful for very large datasets.

---

# Vertical partitioning vs Horizontal partitioning

## Horizontal partitioning

Split rows.

```text
users

1  Alice
2  Bob
3  Charlie
4  David
```

↓

```text
Partition 1

1 Alice
2 Bob
```

```text
Partition 2

3 Charlie
4 David
```

---

## Vertical partitioning

Split columns.

```text
users

id | name | email | address
```

↓

```text
users_basic

id | name
```

```text
users_details

id | email | address
```

---

# Partition pruning

Suppose we have:

```text
users

├── p_2023
├── p_2024
└── p_2025
```

Query:

```sql
SELECT * FROM users
WHERE year = 2025;
```

The database automatically ignores:

```text
p_2023 ❌

p_2024 ❌

p_2025 ✅
```

This is called **partition pruning**.

---

# Benefits of partitioning

- Faster queries
    
- Smaller indexes
    
- Easier backups
    
- Easier maintenance
    
- Better organization
    
- Faster deletion of old data
    

---

# Drawbacks of partitioning

- Adds complexity
    
- Choosing a bad partition key causes hotspots
    
- Cross-partition joins can be expensive
    
- Repartitioning is difficult
    

---

# How to choose a partition key?

A good partition key should:

- Distribute data evenly.
    
- Avoid hotspots.
    
- Match common query patterns.
    
- Minimize cross-partition queries.
    

Good examples:

- `created_at`
    
- `workspace_id`
    
- `user_id`
    

Bad examples:

- `country` (if most users are from one country)
    

---

# Real-world examples

### E-commerce

Partition orders by year:

```text
orders

├── orders_2023
├── orders_2024
└── orders_2025
```

---

### Social media

Partition posts by user ID:

```text
posts

├── partition_1
├── partition_2
├── partition_3
└── partition_4
```

---

### Logging systems

Partition logs by month:

```text
logs

├── January
├── February
├── March
└── April
```

---

# Partitioning in PostgreSQL

```sql
CREATE TABLE orders (
    id SERIAL,
    order_date DATE
) PARTITION BY RANGE (order_date);
```

Create partitions:

```sql
CREATE TABLE orders_2025
PARTITION OF orders
FOR VALUES FROM ('2025-01-01')
TO ('2026-01-01');
```

---

# Mental model

Imagine a library with 10 million books.

Without partitioning:

```text
One giant room with all books.
```

With partitioning:

```text
Room 1 → Science

Room 2 → History

Room 3 → Literature
```

You don't search the entire library; you only go to the correct room.

---
# Non-Relational Databases (NoSQL)

## What is a NoSQL database?

A NoSQL database is a database that does not rely on the traditional relational model (tables, rows, and joins). It is designed to handle massive amounts of data, high throughput, and flexible schemas.

Unlike SQL databases, NoSQL databases prioritize scalability, availability, and performance.

---

# Why do we need NoSQL?

Relational databases are great, but they have some limitations:

- Fixed schema
    
- Expensive joins
    
- Difficult horizontal scaling
    
- Not suitable for unstructured data
    
- Complex sharding
    

NoSQL databases were designed to solve these problems.

---

# Types of NoSQL databases

## 1. Key-Value databases

Data is stored as a key-value pair.

```text
user:123 → {
    "name": "Angshu",
    "age": 21
}
```

Examples:

- Redis
    
- DynamoDB
    
- Riak
    

### Use cases

- Caching
    
- Sessions
    
- Leaderboards
    
- Shopping carts
    

### Complexity

```text
GET(key)  → O(1)
SET(key)  → O(1)
```

---

## 2. Document databases

Data is stored as JSON-like documents.

```json
{
    "id": 123,
    "name": "Angshu",
    "skills": ["Rust", "Postgres"],
    "college": "JEC"
}
```

Examples:

- MongoDB
    
- CouchDB
    
- Firestore
    

### Use cases

- User profiles
    
- Blogs
    
- CMS
    
- E-commerce
    

---

## 3. Column-family databases

Data is stored by columns instead of rows.

```text
user_id | name  | city
------------------------
1       | John  | Delhi
2       | Bob   | Assam
```

Examples:

- Cassandra
    
- HBase
    
- ScyllaDB
    

### Use cases

- Time-series data
    
- Analytics
    
- Logging systems
    
- IoT
    

---

## 4. Graph databases

Data is stored as nodes and edges.

```text
Alice ----friend----> Bob

Bob ------friend----> Charlie
```

Examples:

- Neo4j
    
- ArangoDB
    

### Use cases

- Social networks
    
- Recommendation systems
    
- Fraud detection
    

---

# SQL vs NoSQL

|SQL|NoSQL|
|---|---|
|Fixed schema|Flexible schema|
|ACID|Often eventual consistency|
|Joins supported|Limited joins|
|Vertical scaling|Horizontal scaling|
|Structured data|Structured + unstructured|
|PostgreSQL, MySQL|MongoDB, Redis, Cassandra|

---

# How sharding works in NoSQL databases

One of the biggest advantages of NoSQL databases is that many of them support sharding natively.

Instead of manually routing requests, the database itself often handles routing.

---

## Example: MongoDB sharding

Suppose we shard users by `user_id`.

```text
shard = hash(user_id) % 3
```

```text
User 1 → Shard 0

User 2 → Shard 1

User 3 → Shard 2
```

Architecture:

```text
          Client
             │
             ▼

         Router (mongos)
             │
     ┌───────┼───────┐
     ▼       ▼       ▼

   Shard1  Shard2  Shard3
```

The client sends the request to the router (`mongos`), and MongoDB decides where the data lives.

---

## Example: Cassandra

In Cassandra, each node is responsible for a range of hash values.

```text
partition = hash(key)
```

```text
0 ────────────── 1000 → Node 1

1001 ─────────── 2000 → Node 2

2001 ─────────── 3000 → Node 3
```

The partition key determines which node stores the data.

---

# Partition key in NoSQL

The partition key is one of the most important decisions.

Example:

```text
user_id = 123
```

The database computes:

```text
hash(user_id) % N
```

where:

- `user_id` = partition key
    
- `N` = number of shards
    

---

## Good partition key

A good partition key should:

- Distribute data evenly.
    
- Avoid hotspots.
    
- Keep related data together.
    
- Scale well.
    

Good examples:

- `user_id`
    
- `workspace_id`
    
- `order_id`
    

Bad examples:

- `country`
    
- `gender`
    

---

# Hotspot problem

Suppose we partition by country:

```text
India  → Shard 1

USA    → Shard 2

Japan  → Shard 3
```

If 90% of users are from India:

```text
Shard 1 → overloaded ❌
```

This is called a **hotspot**.

---

# Replication in NoSQL

Most NoSQL databases replicate data automatically.

Example:

```text
                Node 1
               /      \
              /        \

          Node 2      Node 3
```

Replication factor = 3.

Each piece of data is stored on three nodes.

---

# CAP theorem

A distributed database can guarantee only two of the following:

- Consistency (C)
    
- Availability (A)
    
- Partition tolerance (P)
    

Since network failures are unavoidable, every distributed database chooses between:

- CP (Consistency + Partition tolerance)
    
- AP (Availability + Partition tolerance)
    

Examples:

|Database|Choice|
|---|---|
|MongoDB|CP|
|Cassandra|AP|
|DynamoDB|AP|
|HBase|CP|

---

# Choosing the right database

## Use PostgreSQL/MySQL when:

- Strong consistency is required.
    
- Complex joins are needed.
    
- ACID transactions are important.
    
- Data is highly structured.
    

Examples:

- Banking systems
    
- Payment systems
    
- Order management
    

---

## Use MongoDB when:

- Schema changes frequently.
    
- Data is JSON-like.
    
- Fast development is needed.
    

Examples:

- Blogs
    
- CMS
    
- User profiles
    

---

## Use Redis when:

- Ultra-low latency is needed.
    
- Data can live in memory.
    
- Fast reads/writes are required.
    

Examples:

- Caching
    
- Sessions
    
- Rate limiting
    

---

## Use Cassandra when:

- Massive write throughput is needed.
    
- High availability is critical.
    
- Data is distributed globally.
    

Examples:

- IoT
    
- Logging
    
- Analytics
    

---

## Use Elasticsearch when:

- Full-text search is required.
    

Examples:

- Search engines
    
- Product search
    
- Log analysis
    

---

## Use Neo4j when:

- Relationships are the most important part of the data.
    

Examples:

- Social networks
    
- Recommendations
    
- Fraud detection
    

---

# Polyglot persistence

Large systems often use multiple databases.

Example: Instagram

```text
User profiles      → PostgreSQL

Cache              → Redis

Search             → Elasticsearch

Analytics          → Cassandra
```

There is no "best database"; choose the one that solves your problem.

---

# Mental model

Think of databases as tools:

```text
Hammer      → Redis

Screwdriver → PostgreSQL

Wrench      → MongoDB
```

You don't use a hammer for every problem.

---
