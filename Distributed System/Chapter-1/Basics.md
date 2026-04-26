
## ==Data-Intensive vs Compute-Intensive Applications==

```
Many applications today are data-intensive, as opposed to compute-intensive.
```
### Data-intensive application
A system where the main challenges are storing, managing, and processing large amounts of data efficiently rather than performing heavy computations.

### Compute-intensive application  
A system where the main challenge is performing complex calculations that require high CPU or GPU power.

Reality check  
This is mostly true for web and backend systems. However, modern AI systems are highly compute-intensive. Many real systems today are a combination of both.

Better statement  
Most applications are data-heavy systems with some compute-heavy components.

---
**Object World → Serialization → Byte Stream (Network) → Storage Representation**
## ==What makes an application Data-Intensive?==

Databases  
Used to store and retrieve data later

Caches  
Used to store results of expensive operations to improve speed

Search indexes  
Used to quickly find data based on keywords or filters

Stream processing  
Used to process continuous streams of data in real time

Batch processing  
Used to process large amounts of accumulated data at once

---

## Stream Processing

#### Definition 
Processing data ***continuously*** in real time as it arrives.

#### Characteristics  
- Data is processed immediately  
- Low latency  
- Continuous flow of events

#### Examples  
- Chat systems  
- Live notifications  
- Fraud detection

---

## Batch Processing(*parallelism*)

##### Definition  
Processing a large amount of data together after collecting it over time.

#### Characteristics  
- Data is processed later  
- High latency  
- Efficient for large datasets

#### Examples  
- Daily reports  
- Analytics jobs  
- Log processing

---
# ==What is a database?==

A system designed to ==**store, organize, and retrieve data== efficiently**

## Examples

- SQL databases(Relational)
    - MySQL
    - PostgreSQL
- NoSQL databases(Document)
    - MongoDB

## ==Thinking About Data Systems==

## Traditional view  
Databases, queues(FIFO), caches, and search systems are considered ==different categories== because they have different purposes and access patterns.

Example  
Database stores and retrieves structured data  
Message queue handles asynchronous communication  
Cache stores frequently accessed data for speed

---

# ==Why group them as “Data Systems”==

## ==Reason 1==: Earlier, systems had clear roles. Now, one tool can do multiple roles

Modern tools do not fit into strict categories anymore

Examples  
Redis can act as both a database and a message queue  
Apache Kafka behaves like a message queue but also provides durability like a database

Conclusion  
Categories like database, queue, and cache are no longer strictly separate

---

## ==Reason 2==: One tool is not enough anymore

Modern applications have complex requirements

A single system cannot handle everything efficiently

So systems are built by combining multiple tools

---

## ==Combining Multiple Systems==

Typical architecture

- ==***Main database***== for storage
- ==*Cache*== for fast access
- ==*Search index*== for querying
- ==*Stream system*== for real-time processing

Application code connects and coordinates all of them


![[data-system.png]]

---

## ==Responsibility of the Application==

When multiple systems are used, the application must:

- Keep cache in sync with database
- Keep search index updated
- Handle consistency between systems

Example  
If data is updated in database, cache must also be updated or invalidated

---

## ==Important Design Questions==

How to ensure data remains correct even if ==failures== happen  
How to maintain good ==performance== under heavy load  
How to ==scale== when users or data increase  
How to design a clean and usable API

---

## ==Three Core Goals of Data Systems==

### ==Reliability==

System should continue working correctly even when failures occur

Includes:

- hardware failures
- software bugs
- human errors

---

### ==Scalability==

System should handle growth in:(forward and backward compatibility)

- data size
- traffic
- complexity

Should scale without breaking or degrading badly

---

### ==Maintainability==

System should be easy to:

- understand
- modify
- extend

Multiple developers should be able to work on it efficiently over time

---
