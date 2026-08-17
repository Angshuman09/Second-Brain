## <span style="color: pink;">Day-1</span>

# Load Balancer

## What is a Load Balancer?

A **load balancer** distributes incoming requests across multiple servers instead of sending all traffic to a single server.

Without a load balancer:

![[withoutloadbalancer.png]]

If one server receives all requests, it can become a bottleneck.

With a load balancer:

![[loadbalancer.png]]

The load balancer acts as the entry point and decides **which backend server should handle each request**.

---

# Why Do We Need Load Balancers?

A single server has limited:

- CPU
    
- memory
    
- network bandwidth
    
- connection capacity
    

Instead of continuously making one server larger (**vertical scaling**), we can add more servers (**horizontal scaling**).

```text
              Load Balancer
              /     |     \
             /      |      \
          Server  Server  Server
            1       2       3
```

The load balancer distributes traffic across these servers.

---

# Key Advantages

## 1. Scalability

Load balancers make horizontal scaling easier.

Suppose traffic increases:

```text
Before:

Load Balancer
    |
    └── Server 1
```

Add more servers:

```text
After:

          Load Balancer
          /     |     \
         /      |      \
       S1       S2      S3
```

The application can handle more concurrent traffic.

You can also add/remove servers without changing the client-facing endpoint.

---

## 2. High Availability

If one server fails, the load balancer can stop sending traffic to it.

![[availability.png]]

Requests can continue going to S1 and S3.

This is usually achieved through **health checks**.

For example:

```text
GET /health

200 OK → healthy
timeout → unhealthy
500 → unhealthy
```

The load balancer periodically checks backend servers and removes unhealthy servers from the pool.

---

## 3. Fault Isolation

A failure in one backend doesn't necessarily bring down the entire application.

```text
S1 → healthy
S2 → failed
S3 → healthy
```

Traffic can continue through S1 and S3.

---

## 4. Better Resource Utilization

Without load balancing:

```text
S1 → 90% CPU
S2 → 20% CPU
S3 → 10% CPU
```

A good load-balancing strategy attempts to distribute traffic more evenly.

---

# Types of Load Balancers

Load balancers can be categorized in different ways.

One common distinction is based on **which layer they operate at**.

## Layer 4 Load Balancer

Works at the **transport layer**.

Typically uses:

- IP address
    
- TCP/UDP
    
- port
    

It doesn't need to understand the HTTP request itself.

```text
Client
  |
TCP connection
  |
L4 Load Balancer
  |
  +──> Server 1
  +──> Server 2
```

Because it operates at a lower level, it can be very fast.

---

## Layer 7 Load Balancer

Works at the **application layer**, usually HTTP/HTTPS.

It can inspect things such as:

- URL
    
- HTTP method
    
- headers
    
- cookies
    
- hostname
    

For example:

```text
/api/users/*   → User service
/api/orders/*  → Order service
/images/*      → Image service
```

This allows more sophisticated routing.

---

# Load Balancing Algorithms

The load balancer needs a strategy to decide:

> **Which server should receive this request?**

There are many algorithms.

---

# 1. Round Robin

The simplest approach.

Requests are distributed sequentially across servers.

Suppose we have:

```text
S1
S2
S3
```

Requests:

```text
Request 1 → S1
Request 2 → S2
Request 3 → S3
Request 4 → S1
Request 5 → S2
Request 6 → S3
```

Conceptually:

```text
        ┌──> S1
        ├──> S2
LB ─────┼──> S3
        ├──> S1
        ├──> S2
        └──> S3
```

### Advantages

- Very simple
    
- Low overhead
    
- Works well when servers have similar capacity and requests have similar cost
    

### Problem

It doesn't consider the current load on each server.

For example:

```text
S1 → 95% CPU
S2 → 20% CPU
S3 → 10% CPU
```

Round robin may still send the next request to S1.

---

# 2. Weighted Round Robin

Not all servers necessarily have the same capacity.

Suppose:

```text
S1 → weight 3
S2 → weight 2
S3 → weight 1
```

The load balancer sends approximately:

```text
S1 → 3 requests
S2 → 2 requests
S3 → 1 request
```

Over time:

```text
S1 ██████
S2 ████
S3 ██
```

This is useful when servers have different CPU/memory capacities.

For example:

```text
S1 → 16 CPU cores
S2 → 8 CPU cores
S3 → 4 CPU cores
```

You can give them weights proportional to their capacity.

### Limitation

It still doesn't necessarily reflect **current** load.

---

# 3. Least Connections

Instead of simply counting requests, the load balancer looks at the number of **active connections** on each server.

Suppose:

```text
S1 → 100 connections
S2 → 20 connections
S3 → 50 connections
```

The next request goes to:

```text
S2
```

because it currently has the fewest connections.

```text
             ┌── S1: 100
LB ──────────┼── S2: 20  ← next
             └── S3: 50
```

This can work better when requests have different processing times.

### Example

Imagine:

```text
Request A → takes 10 seconds
Request B → takes 50 ms
```

With round robin, a server could receive several long-running requests and become overloaded.

Least connections can account for this indirectly because those long-running connections remain active.

---

# 4. Hash-Based Routing

The load balancer calculates a hash based on some property of the request.

For example:

```text
hash(client_id) % number_of_servers
```

Suppose:

```text
client_id = 123
hash(123) → Server 2
```

Future requests from that client are likely to go to the same server.

```text
Client 123
    |
    +── Request 1 ──> S2
    +── Request 2 ──> S2
    +── Request 3 ──> S2
```

Common hashing inputs include:

- client IP
    
- session ID
    
- user ID
    
- request key
    

---

## Why is Hash-Based Routing Useful?

It can provide a form of **session affinity (sticky sessions)**.

Suppose the application stores session state locally:

```text
User
 |
 v
S2
 |
 └── Session data
```

If the same user keeps going to S2, the application can find that local state.

However, relying heavily on sticky sessions can make scaling and failover harder.

A more scalable design is often:

```text
              Load Balancer
              /     |     \
             S1     S2     S3
              \      |     /
               Shared DB
               / Cache
```

where application servers remain **stateless**.

---

# Consistent Hashing vs Simple Hashing

Be careful with this distinction.

A simple approach:

```text
hash(key) % N
```

has a major problem when `N` changes.

Suppose:

```text
N = 3
hash(key) % 3
```

and then you add another server:

```text
N = 4
hash(key) % 4
```

Many keys will map to different servers.

This can cause massive redistribution.

**Consistent hashing** reduces the amount of data/request reassignment when nodes are added or removed.

This is particularly important in distributed caches and partitioned systems.

---

# Comparing the Algorithms

|Algorithm|Main idea|Good for|
|---|---|---|
|Round Robin|Rotate through servers|Similar servers/requests|
|Weighted Round Robin|Give stronger servers more traffic|Different server capacities|
|Least Connections|Send to server with fewest active connections|Variable request duration|
|Hash-Based|Hash a request attribute|Session affinity / key-based routing|

---

# Health Checks

A load balancer shouldn't blindly send traffic to every server.

It needs to know:

> **Is this backend actually healthy?**

A common approach is a health endpoint:

```text
GET /health
```

The load balancer periodically checks:

```text
LB
├── S1 → 200 OK
├── S2 → timeout
└── S3 → 200 OK
```

Then:

```text
S1 → receive traffic
S2 → remove from pool
S3 → receive traffic
```

When S2 becomes healthy again, it can be added back.

---

# Load Balancer and Stateless Servers

Load balancing works particularly well when application servers are **stateless**.

Instead of:

```text
User
 ↓
S1
 ↓
local session
```

prefer:

```text
             Load Balancer
             /     |     \
            S1     S2     S3
             \      |      /
              Shared state
             DB / Cache
```

Now any server can handle any request.

This is especially important in distributed architectures because servers can be:

- added
    
- removed
    
- restarted
    
- replaced
    
- moved between instances
    

without losing user state.

---

# Single Load Balancer Problem

A load balancer itself can become a **single point of failure**.

Bad design:

```text
              Load Balancer
                   |
             ┌─────┼─────┐
             S1    S2    S3
```

If the load balancer fails, clients can't reach the servers.

A highly available design can use multiple load balancers:

```text
              Clients
                 |
          ┌──────┴──────┐
          LB1           LB2
           |             |
           └──────┬──────┘
                  |
             S1  S2  S3
```

The exact mechanism for distributing traffic between the load balancers can vary, such as DNS-based routing, anycast, or a cloud provider's managed load-balancing infrastructure.

---

# Load Balancer in a Scalable Architecture

A typical architecture might look like:

```text
                    Internet
                       |
                       v
                Load Balancer
                 /     |     \
                /      |      \
              S1       S2       S3
               \       |       /
                \      |      /
                 Database / Cache
```

As traffic increases:

```text
                 Load Balancer
              /    /    |    \    \
             S1   S2    S3    S4   S5
```

You can add more application servers without changing the client-facing endpoint.

This is the core relationship:

> **Load balancing enables horizontal scaling by distributing traffic across multiple instances.**

---

# Important Trade-offs

A load balancer isn't just about "distributing requests evenly."

The algorithm should depend on the workload.

### Round Robin

Simple and predictable, but doesn't consider load.

### Weighted Round Robin

Better when servers have different capacities.

### Least Connections

Better when connection/request duration varies.

### Hash-Based Routing

Useful when requests need to consistently reach the same server or partition.

But for modern distributed applications, **stateless application servers + shared durable state** are often preferable to depending heavily on sticky sessions.

---

# Mental Model

Remember a load balancer as three fundamental responsibilities:

```text
             Load Balancer
                  |
        ┌─────────┼─────────┐
        ↓         ↓         ↓
     Routing   Health    Scaling
               Checks
```

**Routing:** Which server should handle this request?

**Health checks:** Which servers are currently capable of handling requests?

**Scaling:** How can traffic be distributed across many server instances?

The ultimate goal is:

> **Distribute traffic efficiently while keeping the service scalable and available.**