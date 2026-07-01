
Workflow:

```text
Pick paper → Build MVP → Hit prerequisite gap → Learn prerequisite → Continue
```


---

# 1. Raft: Understandable Consensus

Paper: In Search of an Understandable Consensus Algorithm

## Build

A replicated task manager.

```text
CREATE_TASK "Learn Rust"
COMPLETE_TASK task_id
LIST_TASKS
```

Run 3–5 nodes. Any node can receive requests, but only the leader commits them.

## Minimum prerequisites

- TCP communication
    
- Threads or async programming
    
- Basic persistence (append-only log)
    
- Timeouts and timers
    

## Concepts you'll learn naturally

- Consensus
    
- Quorums
    
- Leader election
    
- Log replication
    
- State machine replication
    
- Safety vs. liveness
    

## Time estimate

4–8 weeks

---

# 2. Dynamo

Paper: "Dynamo: Amazon's Highly Available Key-value Store"

## Build

A distributed URL shortener.

```text
short.ly/abc123 → long URL
```

No leader node.

## Minimum prerequisites

- Hashing
    
- HTTP APIs
    
- Basic replication
    

## Concepts you'll learn naturally

- Consistent hashing
    
- Quorum reads and writes
    
- Vector clocks
    
- Eventual consistency
    
- Gossip protocols
    
- Read repair
    

## Time estimate

4–6 weeks

---

# 3. Chord

Paper: "Chord: A Scalable Peer-to-peer Lookup Protocol"

## Build

A peer-to-peer file lookup system.

```text
find(file_hash) → node location
```

## Minimum prerequisites

- Hash functions
    
- TCP sockets
    

## Concepts you'll learn naturally

- Distributed hash tables (DHTs)
    
- Consistent hashing
    
- Peer-to-peer systems
    
- Routing tables
    
- Overlay networks
    

## Time estimate

2–3 weeks

---

# 4. SWIM

Paper: "Scalable Weakly-consistent Infection-style Process Group Membership Protocol"

## Build

A cluster membership service.

```text
node joined
node failed
node suspected
```

## Minimum prerequisites

- UDP
    
- Timers
    

## Concepts you'll learn naturally

- Failure detection
    
- Gossip protocols
    
- Membership management
    
- Partial failures
    

## Time estimate

1–2 weeks

---

# 5. CRDTs

Paper: A comprehensive study of Convergent and Commutative Replicated Data Types

## Build

A collaborative whiteboard or notes application.

Multiple users edit simultaneously while offline.

## Minimum prerequisites

- Data structures
    
- Serialization
    

## Concepts you'll learn naturally

- Eventual consistency
    
- Causal ordering
    
- Conflict resolution
    
- Vector clocks
    

## Time estimate

2–4 weeks

---

# 6. MapReduce

Paper: "MapReduce: Simplified Data Processing on Large Clusters"

## Build

A mini analytics engine.

Example:

```text
wordcount *.txt
```

or

```text
count page visits from logs
```

## Minimum prerequisites

- File I/O
    
- Processes
    
- RPC basics
    

## Concepts you'll learn naturally

- Distributed execution
    
- Scheduling
    
- Data locality
    
- Fault tolerance
    

## Time estimate

3–4 weeks

---

# 7. Kafka

Paper: "Kafka: A Distributed Messaging System for Log Processing"

## Build

An event streaming platform.

```text
producer → topic → consumer
```

## Minimum prerequisites

- TCP
    
- File I/O
    
- Append-only logs
    

## Concepts you'll learn naturally

- Partitioning
    
- Consumer groups
    
- Offsets
    
- Replication
    
- Backpressure
    

## Time estimate

4–6 weeks

---

# 8. Spanner

Paper: Spanner: Google's Globally Distributed Database

## Build

A globally distributed document store with snapshot reads.

## Minimum prerequisites

- Consensus (Raft or Paxos)
    
- Transactions
    
- MVCC
    
- Logical clocks
    

## Concepts you'll learn naturally

- External consistency
    
- TrueTime
    
- Distributed transactions
    
- Snapshot isolation
    

## Time estimate

8–12 weeks

---

# 9. Bayou

Paper: "Managing Update Conflicts in Bayou"

## Build

An offline-first calendar application.

## Minimum prerequisites

- Replication basics
    
- Serialization
    

## Concepts you'll learn naturally

- Conflict resolution
    
- Eventual consistency
    
- Session guarantees
    

## Time estimate

2–4 weeks

---

# 10. Google File System (GFS)

Paper: "The Google File System"

## Build

A distributed file system.

```text
put file.txt
get file.txt
```

## Minimum prerequisites

- File systems
    
- RPC
    
- Concurrency
    

## Concepts you'll learn naturally

- Chunking
    
- Replication
    
- Leases
    
- Master-worker architecture
    

## Time estimate

4–6 weeks

---

# 11. BitTorrent

Paper: "Incentives Build Robustness in BitTorrent"

## Build

A peer-to-peer file sharing system.

## Minimum prerequisites

- TCP
    
- File I/O
    

## Concepts you'll learn naturally

- Piece exchange
    
- Peer discovery
    
- Distributed scheduling
    
- P2P networking
    

## Time estimate

3–5 weeks

---

# 12. Hybrid Logical Clocks

Paper: "Logical Physical Clocks and Consistent Snapshots in Globally Distributed Databases"

## Build

A distributed event ordering service.

## Minimum prerequisites

- Timestamps
    
- Basic distributed communication
    

## Concepts you'll learn naturally

- Clock skew
    
- Causality
    
- Event ordering
    

## Time estimate

1–2 weeks

---

## Recommended order for your learning style

Choose projects that progressively introduce prerequisites.

```text
SWIM
  ↓
Chord
  ↓
CRDTs
  ↓
Dynamo
  ↓
Raft
  ↓
Kafka
  ↓
GFS
  ↓
MapReduce
  ↓
Spanner
```

Notice what happens:

- Dynamo requires vector clocks → learn them when needed.
    
- Raft requires quorums → learn them when needed.
    
- Spanner requires MVCC → learn it when needed.
    

You never learn fundamentals in isolation.

---

## How to pick your next project

Ask yourself:

1. Does the paper solve a real problem?
    
2. Can I build an MVP in under six weeks?
    
3. Can I demo it in five minutes?
    
4. Does it introduce only one or two major new concepts?
    

If the answer is yes to all four, it's a good project.

For your first paper-driven project, I recommend **SWIM**.

You'll build a complete system in a week or two, and almost every advanced distributed system depends on membership and failure detection. Once you have SWIM, you can reuse it in future projects instead of rebuilding cluster membership every time.