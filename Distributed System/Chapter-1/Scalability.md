
Ability of a system to handle increasing load

---
## ==What is Load==

Load = amount of work on system

Examples

- requests per second
    
- number of users
    
- read vs write ratio
    
- data volume
    

---

## Example: Twitter

Operations

- Post tweet (write)
    
- View timeline (read)
    

==Reads are much higher than writes==
### Posting (writes)

- Around **4–5k tweets per second on average**
- Peak can go **10–12k tweets/sec**
### Reading (timeline views)

- Around **300k requests per second**

![[twitter-example.png]]

---

## Approach 1: Compute on Read

On timeline request

- fetch tweets
    
- join and sort

**Problem**  
Slow for large scale

> **Fan-out** : One tweet goes to many followers. More followers increases load

---

## Approach 2: Precompute on Write

When tweet is posted

- push to all followers(cache or precomputed timeline)
    
- store in their timelines
    

**Advantage** : Fast reads

**Problem** : Very heavy writes

---

## Trade-off

Approach 1  : Cheap writes, expensive reads

Approach 2  : Expensive writes, cheap reads

---

## Solution

Hybrid approach

- Normal users use precompute
    
- High follower users use compute on read
    

---

## Two types of systems

**Batch systems**  
- Focus on throughput  
- How much work per second

**Online systems**  
- Focus on response time  
- Time between request and response

---

## Latency vs Response Time

==**Latency**==  
Time waiting to be processed

==Response time==  
Total time user sees  
Includes latency + processing + network

![[latency_versus_response_time-4.jpg]]

---
# ==How fast is my system for real users and how to calculate?==
## Why average is bad

Let’s say 5 requests took:

100 ms  
120 ms  
110 ms  
115 ms  
2000 ms
### Average (mean)

(100 + 120 + 110 + 115 + 2000) / 5 = 489 ms

Average = **489 ms**

---
### Reality

- 4 users got ~100–120 ms (fast)
- 1 user got 2000 ms (very slow)

It hides the slow request

---

# Use Percentiles instead

![[percentile.png]]

Sort values:

100, 110, 115, 120, 2000

---

## p50 (median)

Middle value → 115 ms

> 50% users are faster than 115 ms

This shows **typical experience**

---
## p95

Roughly near worst case

> 95% users are fast  
> 5% are slow

In this case, p95 ≈ 2000 ms

## Meaning

> Some users are having a very bad experience

---

# Tail Latency

> The slowest requests (like 2000 ms)


![[backend-arch.png]]

---

## ==One slow service affects everything==

Example:

You open an app → it calls:

- user service
- post service
- notification service

If 1 is slow → whole request becomes slow(because of dependency)

---
## Approaches for Coping with Load
  
When load increases, system design must change

---

## ==Scaling types==

### Vertical scaling (scale up)

Use a more powerful machine

- simple
- but expensive and limited

---

### Horizontal scaling (scale out)

Use multiple machines

- distributes load
- more complex

Also called  
shared-nothing architecture

> In real system usually use a mix of both

## Elastic vs Manual scaling

Elastic  
System auto adds resources

Manual  
Humans decide when to scale

---

## ==Stateless vs Stateful==

Stateless services  
Easy to scale (just add more servers)

Stateful systems (databases)  
Hard to scale  
More complexity

---
