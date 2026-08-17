## <span style="color:pink;">Day-1</span>
# Message Broker and Message Queue

## 1. What is a Message?

A **message** is a piece of data sent from one component of a system to another.

For example:

![[message.png]]
Instead of directly calling the Payment Service, the Order Service can send a message to a messaging system.

---

# 2. What is a Message Broker?

A **message broker** is a system that receives messages from producers and delivers them to consumers.

It acts as an intermediary between services.

![[messagebroker.png]]
Examples:

- RabbitMQ
    
- Apache Kafka
    
- Amazon SQS
    
- NATS
    
- ActiveMQ
    

The broker allows services to communicate without needing to directly communicate with each other.

---

# 3. Why use a Message Broker?

Without a broker the Order Service depends directly on the Payment Service.

- If Payment Service is slow or unavailable, the Order Service can also be affected.

With a broker:

- Now the producer can often continue after successfully putting the message into the broker.

- The consumer can process it later.

- This creates **asynchronous communication**.

---

# 4. Producer and Consumer

### Producer

The **producer** creates and sends messages.

```text
Order Service
      |
      | OrderCreated
      v
   Broker
```

### Consumer

The **consumer** receives and processes messages.

```text
Broker
   |
   | OrderCreated
   v
Payment Service
```

The producer and consumer don't necessarily need to know about each other's implementation.

---

# 5. What is a Message Queue?

A **queue** is a messaging structure where messages wait until a consumer processes them.

![[messagequeue.png]]

Messages are typically processed in order, often using **FIFO (First In, First Out)** semantics, although the exact ordering guarantees depend on the system.

The important idea is:

> **A queue allows producers and consumers to operate at different speeds.**

---

# 6. Queue as a Buffer

Suppose your application suddenly receives 100,000 jobs.

Your worker can only process 10,000 jobs per second.

Instead of sending everything directly to the worker:

![[overloaded.png]]

Use a queue:

![[buffer.png]]

The queue acts as a **buffer**.

The producer can continue putting jobs into the queue while workers process them at their own speed.

---

# 7. Message Broker vs Message Queue

These terms are related but not exactly the same.

### Message Queue

A queue is primarily a mechanism for storing messages until they can be consumed.

![[messagequeue.png]]

### Message Broker

A broker is a broader messaging system that can provide:

- Queues
    
- Topics
    
- Routing
    
- Delivery guarantees
    
- Acknowledgements
    
- Retries
    
- Dead-letter queues
    
- Persistence
    
- Consumer management
    

So:

> **A queue is a messaging pattern/data structure, while a message broker is a system that provides messaging capabilities.**

---

# Features of a Message Broker

## 1. Asynchronous Communication

The producer doesn't necessarily need to wait for the consumer to finish processing.

```text
Producer
   |
   v
Broker
   |
   | later
   v
Consumer
```

This reduces coupling between services.

---

## 2. Decoupling

Without messaging:

```text
Service A ---> Service B
```

A needs to know about B and usually depends on B being available.

With a broker:

```text
Service A ---> Broker ---> Service B
```

A only needs to know how to send a message.

This is called **temporal decoupling**.

The producer and consumer don't have to be available at exactly the same time.

---

## 3. Buffering

A broker can absorb temporary traffic spikes.

```text
Traffic spike
     |
     v
  Message Queue
     |
     v
Workers process gradually
```

This prevents consumers from being immediately overwhelmed.

---

## 4. Load Distribution

Multiple consumers can process messages from the same queue.

![[buffer.png]]

Messages can be distributed among workers.

This allows the consumer side to scale horizontally.

---

## 5. Persistence

Some brokers can persist messages to disk.

This means messages don't necessarily disappear if the broker process restarts.

Conceptually:

```text
Producer
   |
   v
Broker
   |
   +--> Memory
   |
   +--> Disk
```

Whether and how this works depends on the broker and its configuration.

---

## 6. Acknowledgements

A consumer can tell the broker:

> "I successfully processed this message."

For example:

```text
Broker ---> Consumer
             |
             | process
             v
          SUCCESS
             |
             | ACK
             v
           Broker
```

The broker can then remove or mark the message as processed.

If the consumer crashes before acknowledging:

```text
Broker ---> Consumer
             |
             X crash
```

the message can potentially be delivered again.

This is the basis for many **at-least-once delivery** systems.

---

# 7. Retry

If processing fails:

```text
Message
   |
   v
Consumer
   |
   X failure
```

the broker/application can retry the message.

For example:

```text
Attempt 1 -> failure
Attempt 2 -> failure
Attempt 3 -> success
```

Retries are useful for temporary failures such as:

- Network errors
    
- Temporary database failures
    
- Service unavailability
    

But retries need care because they can create duplicate processing.

---

# 8. Dead-Letter Queue

What if a message keeps failing?

You don't want:

```text
Message
   |
   v
Fail
   |
   v
Retry
   |
   v
Fail
   |
   v
Retry forever
```

Instead, after some number of attempts:

```text
Queue
  |
  v
Consumer
  |
  X failure
  |
  v
Retry
  |
  X
  |
  v
Dead-Letter Queue
```

A **Dead-Letter Queue (DLQ)** stores messages that couldn't be successfully processed.

This allows engineers to inspect and handle problematic messages later.

---

# 9. Routing

Some message brokers can route messages based on rules.

For example:

```text
OrderCreated
      |
      v
   Broker
   /    \
  v      v
Payment  Analytics
```

A single event can be routed to multiple consumers.

Or different types of messages can go to different queues:

```text
OrderCreated ----> Order Queue
PaymentFailed ---> Payment Queue
EmailRequired ---> Email Queue
```

This is one area where the distinction between **queues, topics, exchanges, and subscriptions** becomes important depending on the messaging system.

---

# 10. Multiple Consumers

A broker can support different consumption models.

### Competing consumers

Multiple workers consume from the same queue:

```text
             +--> Worker 1
             |
Queue -------+--> Worker 2
             |
             +--> Worker 3
```

Each message is generally processed by one worker.

Useful for distributing work.

### Publish/Subscribe

One message can be delivered to multiple consumers:

```text
                 +--> Service A
                 |
Producer --> Topic
                 |
                 +--> Service B
                 |
                 +--> Service C
```

Useful when multiple services need to react to the same event.

---

# 11. Delivery Guarantees

Messaging systems often provide different delivery semantics.

### At-most-once

A message is delivered **zero or one time**.

```text
Message -> Consumer
```

It won't normally be retried, so a message can be lost.

### At-least-once

A message is delivered **one or more times**.

```text
Message -> Consumer
            |
           crash
            |
            v
Message -> Consumer again
```

This can produce duplicates.

Therefore consumers often need to be **idempotent**.

### Exactly-once

The goal is that the effect of processing happens exactly once.

This is much harder to guarantee in distributed systems and often comes with additional constraints or implementation complexity.

Don't casually assume that a broker providing "exactly-once" means every external side effect is magically exactly once.

---

# 12. Backpressure

Suppose producers are generating:

```text
10,000 messages/sec
```

but consumers can process only:

```text
5,000 messages/sec
```

The queue starts growing:

```text
Queue size

100
500
1000
5000
10000
...
```

This is a signal that consumers cannot keep up.

Systems can use techniques such as:

- Scaling consumers
    
- Rate limiting producers
    
- Rejecting requests
    
- Applying backpressure
    
- Prioritizing important messages
    

---

# 13. Message Ordering

Some systems provide ordering guarantees.

For example:

```text
M1
M2
M3
```

may need to be processed in exactly that order.

But ordering can make distributed systems harder to scale.

For example, if you partition messages across multiple workers:

```text
Partition 1 -> Worker 1
Partition 2 -> Worker 2
Partition 3 -> Worker 3
```

global ordering becomes difficult.

Therefore, when designing a messaging system, always ask:

> **Do we actually need ordering, and at what scope?**

Maybe you only need ordering for messages belonging to the same user/order rather than globally.

---

# Message Broker Mental Model

The easiest way to remember a broker:

```text
                  Message Broker
               +------------------+
               |                  |
Producer ----> | Queue / Topic    |
               |                  |
               | Routing          |
               | Persistence      |
               | ACKs             |
               | Retry            |
               | DLQ              |
               +--------+---------+
                        |
                        v
                    Consumers
```

The broker primarily helps with:

```text
Decoupling
    +
Asynchronous communication
    +
Buffering
    +
Load distribution
    +
Reliability
    +
Routing
```

## <span style="color:pink;">Day-2</span>

# Message Streaming and Kafka Essentials

## 1. Message Queue vs Message Streaming

Both involve moving messages between services, but their underlying models are different.

### Message Queue

A traditional message queue generally looks like:

![[messagequeue.png]]

The queue holds messages until consumers process them.

After successful processing, the message is usually acknowledged and removed.

Example:

```text
Queue:

M1 -> M2 -> M3 -> M4

Consumer processes M1

Queue:

M2 -> M3 -> M4
```

The primary purpose is often:

> **Distribute work among consumers.**

For example:

![[buffer.png]]

Each job generally needs to be processed by one worker.

---

# 2. Message Streaming

Message streaming treats messages more like a **continuous stream of events**.

Instead of thinking:

> "This message is waiting to be consumed."

think:

> "This event was appended to a durable sequence of events."

For example:

```text
Event Stream

0    1    2    3    4
|    |    |    |    |
E1   E2   E3   E4   E5
```

Consumers read from this stream at their own pace.

Importantly, reading an event doesn't necessarily delete it.

```text
Stream:

E1 E2 E3 E4 E5 E6 E7
    ^
    |
Consumer A
```

Another consumer can independently read the same events:

```text
Stream:

E1 E2 E3 E4 E5 E6 E7
       ^             ^
       |             |
   Consumer A    Consumer B
```

This is one of the biggest conceptual differences from a traditional queue.

---

# 3. Kafka's Mental Model

The simplest mental model for Kafka is:

> **Kafka is a distributed, durable, append-only log.**

Think of a log:

```text
0     1     2     3     4
+-----+-----+-----+-----+-----+
| E1  | E2  | E3  | E4  | E5  |
+-----+-----+-----+-----+-----+
```

Each event has an **offset**.

```text
Offset 0 -> E1
Offset 1 -> E2
Offset 2 -> E3
Offset 3 -> E4
Offset 4 -> E5
```

Consumers track where they are in this log.

For example:

```text
Consumer A
offset = 3
```

means:

> "I have processed events up to offset 3."

---

# 4. Why is this different from a Queue?

Consider a queue:

```text
Queue

M1 M2 M3 M4
      |
      v
   Consumer
```

After the messages are successfully processed:

```text
Queue

(empty)
```

With Kafka:

```text
Kafka log

E1 E2 E3 E4 E5 E6
       ^
       |
   Consumer
```

The consumer reading E3 does not mean E3 disappears.

Kafka can retain it according to its retention policy.

Another consumer can later read the same event.

This enables multiple independent applications to consume the same stream.

---

# 5. Example: E-commerce System

Imagine an order is created.

```text
Order Service
     |
     v
OrderCreated event
```

Kafka receives it:

```text
Kafka
|
+-- OrderCreated
```

Now multiple services can consume it:

![[multiple-service.png]]

Each consumer can process the same event independently.

This is extremely useful in event-driven architectures.

---

# 6. What is a Kafka Topic?

A **topic** is a named stream of records.

For example:

```text
orders
payments
user-events
click-events
```

You can think of a topic as a logical category of events.

```text
Topic: orders

0   1   2   3   4
|   |   |   |   |
O1  O2  O3  O4  O5
```

Producers publish records to topics.

Consumers consume records from topics.

```text
Producer
    |
    v
 orders topic
    |
    v
 Consumer
```

But a topic is not necessarily stored as one physical file or one machine.

This brings us to partitions.

---

# 7. What is a Kafka Partition?

A **partition is an ordered, append-only sequence of records within a topic.**

A topic can have multiple partitions:

```text
Topic: orders

Partition 0:
0  1  2  3
A  B  C  D

Partition 1:
0  1  2
E  F  G

Partition 2:
0  1  2  3
H  I  J  K
```

The topic is logically one stream:

```text
orders
```

but physically it is divided into partitions.

---

# 8. Why does Kafka need partitions?

Primarily for **scalability and parallelism**.

Suppose one server can handle:

```text
100 MB/s
```

but you need:

```text
500 MB/s
```

You can partition the topic:

```text
Partition 0 -> Server A
Partition 1 -> Server B
Partition 2 -> Server C
Partition 3 -> Server D
Partition 4 -> Server E
```

Now the workload can be distributed across machines.

This is one of the fundamental ideas behind Kafka's scalability.

---

# 9. Ordering in Kafka

Kafka guarantees ordering **within a partition**.

For example:

```text
Partition 0:

0 -> OrderCreated
1 -> PaymentStarted
2 -> PaymentCompleted
3 -> OrderShipped
```

That ordering is preserved.

But if you have multiple partitions:

```text
Partition 0:
A -> B -> C

Partition 1:
D -> E -> F
```

Kafka does **not** provide one global ordering across both partitions.

Therefore:

> **Kafka ordering is per partition, not globally across a topic.**

This is extremely important.

---

# 10. How does Kafka decide which partition gets a message?

A producer chooses a partition.

A common approach is using a **key**.

For example:

```text
key = user_id
```

Kafka can hash the key:

```text
hash(user_id) % number_of_partitions
```

For example:

```text
user:123 -> Partition 2
user:456 -> Partition 0
user:123 -> Partition 2
```

Therefore all events for user 123 can go to the same partition.

```text
Partition 2:

user123: Login
user123: ViewProduct
user123: Purchase
user123: Logout
```

This is useful when you need ordering for a particular entity.

---

# 11. Partitioning is a tradeoff

More partitions give you more potential parallelism:

```text
1 partition
    |
    v
limited parallelism

100 partitions
    |
    v
much more parallelism
```

But more partitions also mean:

- More metadata
    
- More files/log segments
    
- More network connections
    
- More replication work
    
- More operational complexity
    

Therefore:

> **Don't simply create thousands of partitions because more partitions sounds better.**

Partition count should be based on throughput, consumer parallelism, retention, and operational requirements.

---

# 12. Consumer Groups

Consumer groups are one of Kafka's most important concepts.

Suppose:

```text
Topic
Partition 0
Partition 1
Partition 2
```

You have three consumers in the same group:

```text
Consumer Group A

Consumer 1
Consumer 2
Consumer 3
```

Kafka distributes partitions among them:

```text
Partition 0 -> Consumer 1
Partition 1 -> Consumer 2
Partition 2 -> Consumer 3
```

Each partition is assigned to only one consumer **within a consumer group at a time**.

This gives you parallel processing.

---

# 13. Why Consumer Groups are powerful

Suppose you have:

```text
orders topic
```

You want:

```text
Payment Service
Inventory Service
Analytics Service
```

Each service can have its own consumer group:

```text
                  orders
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
    Payment      Inventory   Analytics
    Group        Group       Group
```

Each group independently consumes the same events.

So:

```text
OrderCreated
     |
     +----> Payment Group
     |
     +----> Inventory Group
     |
     +----> Analytics Group
```

This is different from having three consumers in **one** group.

---

# 14. Consumer Group vs Multiple Consumers

### Same group

```text
             Topic
          /    |    \
         P0    P1    P2
         |     |     |
         C1    C2    C3

      Same consumer group
```

Messages are distributed among consumers.

### Different groups

```text
                 Topic
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
    Group A     Group B     Group C
    Payment     Analytics   Search
```

Each group receives the stream independently.

This is one of Kafka's biggest strengths.

---

# 15. The Maximum Consumer Parallelism

There's an important relationship:

```text
Number of useful consumers
        <=
Number of partitions
```

Suppose:

```text
3 partitions
10 consumers
```

Only three consumers can actively own partitions at a time:

```text
P0 -> C1
P1 -> C2
P2 -> C3

C4-C10 -> idle
```

Therefore partitions determine the maximum parallelism of a consumer group.

---

# 16. Kafka Offset

Every record has an offset within its partition.

```text
Partition 0

Offset:
0 -> E1
1 -> E2
2 -> E3
3 -> E4
4 -> E5
```

The consumer maintains its position.

For example:

```text
Consumer offset = 3
```

Kafka knows where the consumer group is in the stream.

This enables consumers to:

- Resume after failure
    
- Replay old events
    
- Start from an earlier point
    
- Process historical data
    

---

# 17. Replay

This is one of Kafka's most useful properties.

Suppose your analytics service processes:

```text
E1
E2
E3
E4
E5
```

Later you discover a bug in your analytics code.

With a traditional queue, those messages may already be gone.

Kafka can retain them.

You can reset the consumer's offset:

```text
Current:

E1 E2 E3 E4 E5
            ^
            consumer
```

Then replay:

```text
E1 E2 E3 E4 E5
    ^
    consumer
```

This allows the application to process historical events again.

---

# 18. Kafka is not just a Queue

This is probably the most important distinction.

A queue primarily answers:

> **"Which worker should process this job?"**

Kafka can answer:

> **"What events happened, and which applications want to consume those events?"**

For example:

```text
Queue:

Job -> Worker
```

Kafka:

```text
Event
 |
 +--> Payment
 +--> Inventory
 +--> Analytics
 +--> Recommendation
```

And those consumers can replay the event history.

---

# 19. Kafka's Internal Architecture

At a high level:

```text
                     Kafka Cluster

             +-------------------------+
             |                         |
Producer --->| Broker 1                |
             | Broker 2                |
             | Broker 3                |
             |                         |
             +-------------------------+
```

Kafka runs as a **cluster of brokers**.

Partitions are distributed across these brokers.

For example:

```text
Topic: orders

Broker 1:
  Partition 0

Broker 2:
  Partition 1

Broker 3:
  Partition 2
```

---

# 20. Partition Replication

Partitions can have replicas.

For example:

```text
Partition 0

Leader -> Broker 1
Replica -> Broker 2
Replica -> Broker 3
```

Conceptually:

```text
             Partition 0
                  |
        +---------+---------+
        |         |         |
        v         v         v
     Broker 1  Broker 2  Broker 3
      Leader    Replica   Replica
```

The leader handles writes and normally serves reads, while followers replicate the partition.

If the leader fails, another replica can become leader.

This gives Kafka fault tolerance.

---

# 21. Leader and Followers

Suppose:

```text
P0:

Broker 1 = Leader
Broker 2 = Follower
Broker 3 = Follower
```

Producer:

```text
Producer
    |
    v
Broker 1
```

Followers replicate the data:

```text
Broker 1
   |
   +----> Broker 2
   |
   +----> Broker 3
```

If Broker 1 fails:

```text
Broker 1 X
```

Kafka can elect another replica as leader.

---

# 22. Kafka's Log

Kafka stores partitions as logs.

Conceptually:

```text
Partition 0

+------+------+------+------+------+
| E0   | E1   | E2   | E3   | E4   |
+------+------+------+------+------+
   ^
   |
append only
```

New records are appended to the end.

Kafka generally doesn't modify old records in place.

This append-only design is important for performance.

---

# 23. Why Append-Only Logs are Fast

Sequential appends are efficient.

Instead of constantly modifying arbitrary locations:

```text
Random writes
  |
  +--> expensive disk operations
```

Kafka primarily does:

```text
Append -> Append -> Append -> Append
```

This works well with modern storage systems and allows Kafka to handle high throughput.

Kafka also uses batching, sequential I/O, compression, and other optimizations.

---

# 24. Kafka Storage and Retention

Kafka doesn't necessarily keep messages forever.

You configure retention.

For example:

```text
retention = 7 days
```

Kafka keeps records for the configured retention period and eventually deletes old log segments.

Another common policy is size-based retention:

```text
retain until partition reaches X GB
```

So:

```text
Old events
    |
    v
Retention policy
    |
    v
Deleted eventually
```

This is fundamentally different from a queue where successful consumption often causes a message to become unavailable to that consumer.

---

# 25. Kafka Consumer Lag

Suppose producers are producing:

```text
1000 messages/sec
```

but consumers process:

```text
800 messages/sec
```

The consumer falls behind.

This is called **consumer lag**.

Conceptually:

```text
Latest Kafka offset: 10000
Consumer offset:      8500

Lag = 1500
```

Consumer lag is one of the most important Kafka monitoring metrics.

Large or continuously increasing lag can indicate:

- Consumers are too slow
    
- Not enough consumers
    
- Expensive processing
    
- Downstream service problems
    
- Insufficient partition parallelism
    

---

# 26. Producer Acknowledgements

Kafka producers can control how much acknowledgement they require.

A simplified view:

```text
acks=0
```

Producer doesn't wait for broker acknowledgement.

Lower latency, weaker durability.

```text
acks=1
```

Leader acknowledges the write.

```text
acks=all
```

Producer waits for the required in-sync replicas to acknowledge.

This provides stronger durability but may increase latency.

The exact durability guarantee also depends on replication and broker configuration.

---

# 27. At-Least-Once Processing

Kafka systems commonly use **at-least-once processing**.

For example:

```text
Consumer receives E1
      |
      v
Process E1
      |
      X crash before committing offset
```

After restarting:

```text
E1
 |
 v
processed again
```

So duplicates can happen.

This means consumers often need **idempotent processing**.

For example, instead of:

```text
charge_customer()
```

blindly executing twice, the application may use an idempotency key:

```text
transaction_id = 123

if already_processed(123):
    ignore
else:
    process
```

---

# 28. Kafka Transactions and Exactly-Once Semantics

Kafka supports mechanisms for stronger processing semantics, including transactions and exactly-once processing in certain Kafka-to-Kafka workflows.

But don't simplify this to:

> "Kafka guarantees exactly once."

Exactly-once behavior becomes much harder when external systems are involved.

For example:

```text
Kafka
  |
  v
Consumer
  |
  v
External Database
```

Ensuring the Kafka offset and external database update behave atomically requires additional design.

This is a classic distributed-systems problem.

---

# 29. Kafka vs Traditional Message Queue

|Feature|Traditional Queue|Kafka|
|---|---|---|
|Primary model|Work queue|Distributed log|
|Message removal|Usually after acknowledgement|Based on retention|
|Replay|Usually limited|Native capability|
|Multiple independent consumers|Possible, but depends on system|Consumer groups|
|Ordering|Often queue-level|Per partition|
|Scaling|Workers/queues|Partitions + brokers|
|Persistence|Depends on broker|Core design|
|Event history|Usually not central|Fundamental|
|High-throughput streaming|Depends on system|Core use case|

Don't treat this table as saying every queue behaves identically. Systems such as RabbitMQ, SQS, and Kafka have different semantics.

---

# 30. Where Does a Traditional Message Queue Fall Short?

This is a better question than saying "queues are bad."

Queues are extremely useful for **work distribution**.

But problems arise when you want to use them as a durable event history.

Imagine:

```text
OrderCreated
     |
     v
Queue
     |
     v
Payment Service
```

Payment processes it.

The message is acknowledged.

Now Analytics comes along later and says:

> "I want to process all OrderCreated events from the last 30 days."

If the queue deleted the messages after consumption:

```text
Queue
(empty)
```

The historical events are gone.

Kafka's model handles this naturally:

```text
Kafka

E1 E2 E3 E4 E5 E6 E7
          ^
          |
      Payment

E1 E2 E3 E4 E5 E6 E7
    ^
    |
 Analytics
```

Different consumers can maintain independent positions.

---

# 31. But Kafka Doesn't Replace Queues Everywhere

This is equally important.

If you have:

```text
Generate thumbnail
Send email
Process payment job
Resize image
```

and each job should be handled by one worker, a traditional work queue may be a better abstraction.

For example:

```text
Jobs
 |
 v
Queue
 |
 +--> Worker 1
 +--> Worker 2
 +--> Worker 3
```

You don't necessarily need Kafka.

Use the simplest system that satisfies the requirements.

---

# 32. Kafka Limitations

Kafka is powerful, but it isn't the best tool for everything.

## 1. Operational complexity

Running a production Kafka cluster involves understanding:

- Brokers
    
- Partitions
    
- Replication
    
- Consumer groups
    
- Rebalancing
    
- Retention
    
- Disk usage
    
- Monitoring
    
- Network traffic
    
- Failure recovery
    

It is significantly more operationally involved than simply using a basic queue service.

Managed Kafka can reduce this burden, but doesn't eliminate the underlying concepts.

---

## 2. Partition management

Partitions are fundamental to Kafka scalability.

But choosing too few or too many partitions can cause problems.

Too few:

```text
Limited consumer parallelism
```

Too many:

```text
More metadata
More replication
More operational overhead
```

Partitioning therefore needs planning.

---

## 3. Global ordering is difficult

Kafka guarantees ordering within a partition.

It does not provide cheap global ordering across many partitions.

If your requirement is:

```text
Every event in the entire system
must be processed in exactly one global order
```

Kafka's partitioned architecture makes that expensive and limits scalability.

---

## 4. Random lookups are not its strength

Kafka is optimized for:

```text
append
   +
sequential consumption
```

It isn't a general-purpose database.

Don't use Kafka as your primary database for arbitrary queries such as:

```sql
SELECT *
FROM users
WHERE email = '...';
```

That's not what it is designed for.

---

## 5. Large messages are problematic

Kafka is designed primarily for streams of relatively manageable records.

Putting huge files or blobs directly into Kafka can cause:

- High memory usage
    
- High network usage
    
- Large disk usage
    
- Increased replication cost
    
- Consumer performance problems
    

Often a better architecture is:

```text
Large file
   |
   v
Object Storage
   |
   v
Kafka
   |
   | object ID / URL
   v
Consumers
```

---

## 6. Consumer lag can become a serious problem

If consumers can't keep up:

```text
Producer
   |
   v
Kafka
   |
   | 1,000,000 events
   v
Consumer
```

lag can grow substantially.

You need monitoring and a strategy for scaling consumers or handling the backlog.

---

## 7. Rebalancing can cause disruption

When consumers join or leave a consumer group, Kafka may need to redistribute partitions.

For example:

```text
Before:

P0 -> C1
P1 -> C1
P2 -> C2
```

C1 dies:

```text
After:

P0 -> C2
P1 -> C2
P2 -> C2
```

Partition reassignment/rebalancing can temporarily affect processing.

Kafka has evolved several mechanisms to make rebalancing less disruptive, but it remains an important operational concern.

---

# 33. Kafka's Sweet Spots

Kafka is particularly good for:

### Event-driven architectures

```text
Service A
   |
   v
Kafka
   |
   +--> Service B
   +--> Service C
   +--> Service D
```

### Event sourcing

```text
Commands
   |
   v
Event Log
   |
   v
Current State
```

### Log aggregation

```text
Servers
  |
  +--> Kafka
  |
  +--> Kafka
  |
  +--> Kafka
       |
       v
Analytics / Storage
```

### Activity tracking

```text
User clicks
User searches
User purchases
User watches
      |
      v
    Kafka
      |
      v
Analytics / ML
```

### Data pipelines

```text
Database
   |
   v
Kafka
   |
   +--> Data Warehouse
   +--> Search
   +--> Analytics
   +--> ML pipeline
```

---

# 34. Kafka's Core Architecture to Remember

Keep this mental model:

```text
                       Kafka Cluster

Producer
   |
   v
+-------------------+
|      Topic        |
|                   |
| P0  P1  P2  P3    |
+-------------------+
 |   |   |   |
 v   v   v   v
B1  B2  B3  B1
 |   |   |   |
 +---+---+---+
     Replicas

             |
             v

       Consumer Group
       +------+------+ 
       |      |      |
      C1     C2     C3
```

The key pieces are:

```text
Producer
   ↓
Topic
   ↓
Partitions
   ↓
Brokers
   ↓
Replication
   ↓
Consumer Groups
   ↓
Offsets
```

---

# 35. Kafka vs RabbitMQ: The Mental Difference

Since you just worked with RabbitMQ, this comparison should make Kafka much easier.

### RabbitMQ

Think:

```text
"Here is a job.
Someone please process it."
```

```text
Producer
   |
   v
Exchange
   |
   v
Queue
   |
   v
Worker
   |
   v
ACK
```

### Kafka

Think:

```text
"Here is an event that happened.
Keep it for some time.
Different applications can consume it independently."
```

```text
Producer
   |
   v
Topic
   |
   +--> Partition 0
   +--> Partition 1
   +--> Partition 2
          |
          v
     Consumer Groups
```

That distinction is more important than memorizing individual Kafka APIs.

---

# 36. The Most Important Things to Remember

If you forget everything else in five years, remember these:

### Kafka is an append-only distributed log

```text
E1 -> E2 -> E3 -> E4 -> E5
```

### Topics contain partitions

```text
Topic
├── Partition 0
├── Partition 1
└── Partition 2
```

### Partitions provide scalability and parallelism

```text
P0 -> Consumer 1
P1 -> Consumer 2
P2 -> Consumer 3
```

### Ordering is per partition

```text
P0: A -> B -> C  ordered
P1: D -> E -> F  ordered

No global A -> B -> C -> D -> E -> F guarantee
```

### Consumer groups provide independent consumption

```text
                 Kafka
              /    |    \
             /     |     \
       Payment  Analytics  Search
        Group     Group     Group
```

### Offsets track consumer progress

```text
E0 E1 E2 E3 E4 E5
       ^
       offset
```

### Retention determines how long events remain

```text
Event
  |
  v
Kafka
  |
  | retention
  v
event eventually deleted
```

### Replication provides fault tolerance

```text
Leader
  |
  +--> Replica
  +--> Replica
```

### Kafka is not automatically "better than RabbitMQ"

The question is:

> **Do I need a work queue, or do I need a durable event stream?**

That is the architectural decision you should make first.

---

# Publish/Subscribe (Pub/Sub)

## What is Pub/Sub?

**Publish/Subscribe (Pub/Sub)** is a messaging pattern where publishers send messages to a named **topic/channel**, and subscribers receive messages from the channels they are interested in.

The publisher does not need to know who the subscribers are.

![[pubsub.png]]

This creates **decoupling** between producers and consumers.

---

## Core Components

### Publisher

The component that produces and publishes messages.

```text
Publisher → "New order created"
```

The publisher only needs to know the channel/topic.

It does not need to know:

- who is consuming the message
    
- how many subscribers exist
    
- where they are running
    

---

### Subscriber

A component that subscribes to one or more channels and receives messages published to those channels.

```text
Subscriber → SUBSCRIBE orders
```

Once subscribed, it receives new messages published to `orders`.

---

### Channel / Topic

A logical name used to group related messages.

For example:

```text
orders
payments
notifications
chat
```

A publisher sends a message to a channel:

```text
PUBLISH orders "Order created"
```

Subscribers subscribed to `orders` receive it.

---

## How Pub/Sub Works

Suppose three subscribers are subscribed to `notifications`.

```text
                 ┌──> Subscriber A
                 |
Publisher ──> Broker ──> Subscriber B
                 |
                 └──> Subscriber C
```

The publisher sends:

```text
"New notification"
```

The broker broadcasts the message to all **currently active subscribers** of that channel.

This is why Pub/Sub is useful for **real-time broadcasting**.

---

# Redis Pub/Sub

Redis provides a built-in Pub/Sub mechanism.

The basic commands are:

### Subscribe

```redis
SUBSCRIBE chat
```

### Publish

```redis
PUBLISH chat "Hello"
```

### Unsubscribe

```redis
UNSUBSCRIBE chat
```

Example:

```text
Terminal 1:

SUBSCRIBE chat


Terminal 2:

PUBLISH chat "Hello"
```

Terminal 1 immediately receives:

```text
"Hello"
```

---

# Important Property: No Message Persistence

Redis Pub/Sub is **not a durable message queue**.

Messages are delivered only to subscribers that are currently subscribed.

Consider:

```text
Publisher
    |
    v
 Redis
    |
    X
No subscribers
```

If the publisher sends:

```text
"Hello"
```

while nobody is subscribed, the message is lost.

A subscriber that joins later does **not** receive the old message.

```text
10:00 → Publisher sends A
10:01 → Subscriber connects
         |
         └── Does not receive A
```

This is one of the most important characteristics of Redis Pub/Sub.

---

# Pub/Sub vs Queue

A traditional message queue generally has a message waiting for a consumer:

```text
Producer
    |
    v
  Queue
    |
    v
Consumer
```

Pub/Sub is different:

```text
Publisher
    |
    v
  Broker
   / | \
  /  |  \
 S1  S2  S3
```

The same message can be delivered to multiple active subscribers.

Therefore:

> **Queue → usually distributes work among consumers.**  
> **Pub/Sub → broadcasts events to subscribers.**

---

# Pub/Sub vs Kafka

This distinction is important.

|Feature|Redis Pub/Sub|Kafka|
|---|---|---|
|Real-time delivery|Yes|Yes|
|Broadcast|Yes|Yes, through consumer groups|
|Persistent messages|No|Yes|
|Replay|No|Yes|
|Consumer groups|No|Yes|
|Message history|No|Yes|
|Acknowledgements|No|Yes, through offsets/consumer commits|
|Best suited for|Real-time notifications/events|Durable event streaming|

Kafka stores records in an append-only log:

```text
Partition

0 → Event A
1 → Event B
2 → Event C
3 → Event D
```

A consumer can later come back and read those records.

Redis Pub/Sub doesn't provide this model:

```text
Publisher
    ↓
Redis Pub/Sub
    ↓
Active subscribers

No durable log
No replay
```

---

# Redis Pub/Sub vs Redis Streams

Redis itself has another feature called **Redis Streams**, which is much closer to a durable messaging system.

### Pub/Sub

```text
Publisher
    ↓
Channel
    ↓
Active subscribers
```

If nobody is listening, the message disappears.

### Streams

```text
Producer
    ↓
Redis Stream
    ↓
Messages stored
    ↓
Consumers
```

Messages can be read later, and Redis Streams support features such as consumer groups and message IDs.

So:

> **Pub/Sub is primarily for ephemeral real-time communication.**

> **Redis Streams are for persistent event/message processing.**

---

# Where Pub/Sub is Useful

Pub/Sub is useful when **real-time delivery matters more than message durability**.

Common examples:

### Chat applications

```text
User A
  ↓
chat:room-123
  ↓
User B
User C
User D
```

### Live notifications

```text
Backend
   ↓
notifications
   ↓
WebSocket servers
   ↓
Connected users
```

### Live dashboards

```text
Application
    ↓
metrics
    ↓
Dashboard clients
```

### Real-time multiplayer events

```text
Game Server
    ↓
game-events
    ↓
Connected players
```

### Cache invalidation

A service can publish:

```text
cache:user:123 invalidated
```

and other application instances can react to it.

---

# Advantages

### Loose coupling

Publishers don't need to know about subscribers.

```text
Publisher → Channel → Subscribers
```

You can add or remove subscribers without changing the publisher.

### Simple

Pub/Sub is easy to implement and understand.

### Low latency

Messages can be delivered immediately to active subscribers.

### Natural broadcasting

One message can reach many subscribers.

---

# Limitations

### No persistence

Messages are not stored for later consumption.

### No replay

A subscriber cannot ask:

> "Give me everything I missed yesterday."

### No durable delivery guarantee

If a subscriber is disconnected when the message is published, it misses the message.

### Not suitable for critical events

For example, you generally wouldn't use basic Pub/Sub as the sole mechanism for:

```text
Payment processed
Bank transaction completed
Order created
Money transferred
```

because losing such an event could be problematic.

For these cases, a durable system such as Kafka, a persistent queue, or Redis Streams may be more appropriate.

---

# Mental Model

The easiest way to remember Pub/Sub:

```text
             Publisher
                 |
                 v
              Channel
             /   |   \
            /    |    \
           v     v     v
          S1    S2    S3
```

**Publish → broadcast → active subscribers receive it.**

There is no assumption that the broker keeps a history for future subscribers.

---