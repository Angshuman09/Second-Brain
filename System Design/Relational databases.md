## <span style="color: lightpink;">05 Lecture</span>

Databases are most critical component of any system. They make or break a system.

Data is stored and represented in <span style="color: #FF7F7F; font-weight: bold;">rows</span> and <span style="color: #FF7F7F; font-weight: bold;">columns</span>

### History of relational databases

Everything "revolutionary" starts with Financial applications:

<span style="color: #CBC3E3; font-weight: bold;">Computer first did "<span style="color:#FF7F7F;">accounting</span>" ⟶ ledgers ⟶ rows and columns</span>

![[ledgers.webp | here is the simple ledger]]
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

![[multi-leader.png]]

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

---

## C. Leaderless Replication

There is no leader.

Any node can accept reads and writes.

```
      Node A
     /     \
Client      Node B
     \     /
      Node C
```

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

### Advantages

- Strong consistency
    

### Disadvantages

- Slower
    

---

## Asynchronous replication

The primary responds immediately and updates replicas later.

### Advantages

- Faster
    

### Disadvantages

- Replicas may contain stale data
    

---

# Quick comparison

|Type|Writes|Reads|Complexity|
|---|---|---|---|
|Single leader|One node|Multiple nodes|Low|
|Multi leader|Multiple nodes|Multiple nodes|Medium|
|Leaderless|Any node|Any node|High|

---

# 4. Sharding (Short Notes)

**Sharding** means splitting data across multiple databases.

Instead of storing everything in one database:

```
DB1 → Users 1–1M
DB2 → Users 1M–2M
DB3 → Users 2M–3M
```

Each database stores only a subset of the data.

### Why sharding?

- Handle huge datasets
    
- Increase write throughput
    
- Reduce load on a single server
    

### Challenges

- Rebalancing data
    
- Joins across shards
    
- Hotspots
    
- Complex queries
    

We will discuss sharding in detail in the next chat.

---

# Interview summary

- Vertical scaling = bigger machine.
    
- Horizontal scaling = more machines.
    
- Replication = copy data to multiple servers.
    
- Sharding = split data across multiple servers.
    
- Replication improves read performance and availability.
    
- Sharding improves storage and write scalability.