# <span style="color:pink;">Caching</span>

## What is a cache?

A cache is a fast storage layer that stores frequently accessed data so that future requests can be served much faster.

Instead of fetching data from a slow source (database, disk, or another service) every time, we first check whether the data already exists in the cache.

If the data exists, we return it immediately.

![[caching.png]]

---

## Why do we need caching?

### 1. Reduce latency

Databases and disks are slower than memory.

Without cache:

```
Client → Database (100 ms)
```

With cache:

```
Client → Cache (5 ms)
```

Users get faster responses.

---

### 2. Reduce database load

Imagine a post with 1 million views.

Without cache:

- 1 million database queries

With cache:

- Most requests are served from the cache.
- Database load decreases significantly.

---

### 3. Improve scalability

Caching allows a system to handle more users without continuously upgrading the database servers.

For example:

- Database can handle 10,000 requests/second.
- With caching, the system can handle 100,000 requests/second.

---

### 4. Reduce cost

Fewer database queries mean:

- Lower CPU usage
- Lower bandwidth consumption
- Lower infrastructure cost

---

## Is cache only restricted to RAM?

No. Cache is **not limited to RAM**.

Caches can exist at different levels.

| Type | Example |
|---|---|
| CPU cache | L1, L2, L3 cache |
| RAM cache | Redis, Memcached |
| Disk cache | Browser cache, SSD cache |
| CDN cache | Cloudflare |
| Application cache | In-memory HashMap |
| Database cache | Query cache |

RAM is the most common choice because it is much faster than disks, but caching can happen almost anywhere.

---

## Examples of caches

### 1. Browser cache

When you visit a website, images, CSS, and JavaScript files are stored locally.

The next time you visit the website, your browser loads them from the cache instead of downloading them again.

---

### 2. CPU cache

The CPU stores frequently used instructions and data in L1, L2, and L3 caches.

Accessing cache takes nanoseconds, while fetching from RAM is slower.

---

### 3. Redis cache

Suppose Instagram stores user profiles in a database.

Without cache:

```
User request → Database
```

With Redis:

```
User request → Redis → Database
```

Popular profiles are served directly from Redis.

---

### 4. CDN cache

A CDN stores images and videos closer to users.

For example:

- User in India requests an image.
- The image is served from a nearby CDN server instead of the original server in the US.

---

## Cache terminology

### Cache hit

The requested data is found in the cache.

```
Cache → Data found ✓
```

Fast response.

---

### Cache miss

The requested data is not present in the cache.

```
Cache → Data not found ✗
Database → Fetch data
Cache → Store data
```

The response is slower because we need to access the database.

---
# Caching Strategies

## 1. Lazy population (Cache-aside)

In lazy population, data is loaded into the cache **only when it is requested**.

![[lazypopulation.png]]

### Example

Suppose a user requests their profile.

```text
GET /user/123
```

Cache doesn't contain the profile.

```text
Cache miss
      ↓
Database query
      ↓
Store in Redis
      ↓
Return response
```

The next request will be served directly from Redis.

### Advantages

- Saves memory because only frequently accessed data is cached.
    
- Simple to implement.
    
- Works well for unpredictable access patterns.
    

### Disadvantages

- First request is slow (cache miss).
    
- Sudden traffic spikes can overload the database.
    

---

## 2. Eager population (Write-through cache)

In eager population, data is inserted into the cache **as soon as it is written to the database**.

![[eagercache.png]]
### Example

A user changes their username.

```text
UPDATE users
SET username = 'angshu'
WHERE id = 1;
```

Immediately after updating the database:

```text
SET user:1 "angshu"
```

Now future reads don't need to hit the database.

### Advantages

- Cache is always warm.
    
- Faster reads.
    
- Lower cache-miss rate.
    

### Disadvantages

- Wastes memory on rarely used data.
    
- Extra work during writes.
    

---

# 3. Proactively pushing data to cache (Cache warming)

Instead of waiting for users to request data, the system preloads popular data into the cache.

### Example: Instagram

Every morning, millions of users open Instagram.

The system already knows which posts are trending.

Before users open the app:

![[proactivelypushing.png]]

>**Why Cache Warming?**
>
>Eliminates cold-start latency for popular content. Prevents database load spikes when traffic floods in

---

### Advantages

- Very low latency.
    
- Prevents database overload.
    
- Better user experience.
    

### Disadvantages

- Requires predicting what users will access.
    
- May waste memory.
    

---

# 4. Scaling cache

As traffic increases, a single cache server becomes insufficient.

### Vertical scaling

Increase the resources of one machine:

- More RAM
    
- More CPU
    

```text
8 GB RAM → 32 GB RAM → 128 GB RAM
```

#### Problems

- Expensive
    
- Hardware limits exist
    
- Single point of failure
    

---

### Horizontal scaling

Add more cache servers.

```text
          ┌─────────┐
Client ──►│ Redis 1 │
          └─────────┘

          ┌─────────┐
Client ──►│ Redis 2 │
          └─────────┘

          ┌─────────┐
Client ──►│ Redis 3 │
          └─────────┘
```

---

## Partitioning cache

Split data among multiple cache servers.

Example:

```text
user:1–10000      → Redis 1

user:10001–20000  → Redis 2

user:20001–30000  → Redis 3
```

Or use hashing:

```text
hash(key) % 3
```

```text
user:123 → Redis 1

user:456 → Redis 2

user:789 → Redis 3
```

---

## Replication

Create replicas of cache servers.

```text
            Master
               │
        ┌──────┴──────┐
        │             │
     Replica 1    Replica 2
```

If the master crashes, a replica can take over.

---

## Problems while scaling cache

### Cache miss storm

Many users request missing data simultaneously.

```text
1000 requests
      ↓
Cache miss
      ↓
Database overload
```

---

### Hot keys

A few keys receive enormous traffic.

Example:

```text
user:elon_musk
```

Millions of requests hit the same cache node, creating imbalance.

---

### Cache inconsistency

Database and cache contain different values.

```text
Database: age = 21

Cache: age = 20
```

This stale data problem must be handled carefully.

---

# Summary

|Strategy|When data enters cache|
|---|---|
|Lazy population|On first read|
|Eager population|On write|
|Proactive push|Before users request it|

---
