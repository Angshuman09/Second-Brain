
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

```text
Producer
   |
   v
+----------------------+
| M1 | M2 | M3 | M4   |
+----------------------+
          |
          v
       Consumer
```

Messages are typically processed in order, often using **FIFO (First In, First Out)** semantics, although the exact ordering guarantees depend on the system.

The important idea is:

> **A queue allows producers and consumers to operate at different speeds.**

---

# 6. Queue as a Buffer

Suppose your application suddenly receives 100,000 jobs.

Your worker can only process 10,000 jobs per second.

Instead of sending everything directly to the worker:

```text
100,000 requests
       |
       v
    Worker
       |
       X
   overloaded
```

Use a queue:

```text
100,000 requests
       |
       v
     Queue
       |
       v
     Worker
```

The queue acts as a **buffer**.

The producer can continue putting jobs into the queue while workers process them at their own speed.

---

# 7. Message Broker vs Message Queue

These terms are related but not exactly the same.

### Message Queue

A queue is primarily a mechanism for storing messages until they can be consumed.

```text
Producer -> Queue -> Consumer
```

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

```text
                 +--> Worker 1
                 |
Queue -----------+--> Worker 2
                 |
                 +--> Worker 3
```

Messages can be distributed among workers.

This allows the consumer side to scale horizontally.

For example:

```text
1000 jobs/sec
      |
      v
    Queue
   /  |  \
  v   v   v
 W1  W2  W3
```

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

## One-line definition

> **A message broker is an intermediary system that accepts messages from producers, stores/routes them, and delivers them to consumers, allowing distributed services to communicate asynchronously and independently.**

For system design, the next important distinction to learn after this is **message broker vs Kafka vs RabbitMQ vs SQS**, because they solve overlapping problems but have very different architectures and delivery/ordering models.