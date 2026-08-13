
**Sharding helps scale a database because it splits the data and query load across multiple machines instead of forcing a single machine to handle everything.**

Imagine you have **1 billion users**.

Without sharding:

- One database server stores all 1 billion users.
- All reads and writes go to that single server.
- One CPU, one RAM, and one disk become the bottleneck.

```
Users (1B)
     │
     ▼
┌───────────┐
│ Database  │
└───────────┘
```

Suppose that server can handle **10,000 queries per second (QPS)**. If your application suddenly receives **50,000 QPS**, the server crashes or becomes very slow.

Now let's shard the database into five shards:

```
Shard 1 → users 1–200M
Shard 2 → users 200M–400M
Shard 3 → users 400M–600M
Shard 4 → users 600M–800M
Shard 5 → users 800M–1B
```

```
                 Users
                   │
 ┌─────────┬─────────┬─────────┬─────────┬─────────┐
 ▼         ▼         ▼         ▼         ▼
DB1       DB2       DB3       DB4       DB5
```

Now:

- Each database stores only **200 million users**.
- Each machine handles only **10,000 QPS**.
- Total capacity becomes **50,000 QPS**.

So, by adding more machines, you increase:

- Storage capacity
- Query throughput
- Write throughput

This is why DDIA says:

> "A large dataset can be distributed across many disks, and the query load can be distributed across many processors."

Replication and sharding solve **different problems**:

| Technique | Solves |
|---|---|
| Replication | Availability and read scaling |
| Sharding | Storage and write scaling |

For example, if you replicate one database to five replicas, every replica still stores **all the data**. You gain fault tolerance and more read capacity, but writes still hit the primary server.

With sharding, the data itself is divided:

- User 123 → Shard 1
- User 456 → Shard 2
- User 789 → Shard 3

So writes are also distributed across multiple machines.

In one sentence:

**Sharding scales a database by dividing both the data and the workload among many servers, allowing the system to handle more data and more queries simply by adding more machines.**