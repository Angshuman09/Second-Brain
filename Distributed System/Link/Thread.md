In a **low-level (system/OS) perspective**, a **thread** is the **smallest unit of execution that the CPU scheduler can run**.

---
## 1. Process vs Thread (Low-Level View)

**Process**

- A running program.
    
- Has its **own memory space**.
    

**Thread**

- A **path of execution inside a process**.
    
- Threads **share the same memory** of the process.
    

Example:

```
Process (Chrome)

   ├── Thread 1 → UI rendering
   ├── Thread 2 → Network requests
   └── Thread 3 → JavaScript execution
```

All threads share:

- heap memory
    
- global variables
    
- open files
    

But each thread has its own:

- **stack**
    
- **CPU registers**
    
- **program counter**
    

---

## 2. What Actually Exists for a Thread (Inside OS)

At a very low level, a thread mainly contains:

**1. Program Counter (PC)**  
Address of the **next instruction** the CPU should execute.

**2. Registers**  
CPU working memory (temporary values).

**3. Stack**  
Stores:

- function calls
    
- local variables
    
- return addresses
    

**4. Thread ID**

---

### Visual Representation

```
Process Memory

+------------------+
|  Code Segment    |
+------------------+
|  Heap            |
|  (shared)        |
+------------------+
|  Global Data     |
+------------------+

Thread 1
   Stack
   Registers
   Program Counter

Thread 2
   Stack
   Registers
   Program Counter
```

---

## 3. What the CPU Actually Runs

The **CPU does not run processes**.

It runs **threads**.

The **OS scheduler** decides which thread runs next.

Example timeline:

```
Time →

Thread A running
Thread B running
Thread C running
Thread A running
```

This switching is called **context switching**.

---

## 4. Why Concurrency Problems Happen

Because threads **share memory**.

Example:

```
balance = 1000
```

Thread A:

```
read balance
```

Thread B:

```
balance = balance - 500
```

If both run simultaneously:

- A may read while B is modifying it.
    
- Result = inconsistent data.
    

This is exactly the problem mentioned in **Designing Data-Intensive Applications** when talking about **B-tree concurrency**.

---

## 5. Ultra-Low-Level View (Assembly Thinking)

At the CPU level a thread is basically:

```
Instruction pointer
Registers
Stack
```

Example execution:

```
MOV R1, 5
ADD R1, 10
STORE R1 → memory
```

The CPU executes these instructions for **one thread at a time per core**.

---

## 6. One Sentence Definition

**Thread = execution state (PC + registers + stack) that the CPU scheduler runs inside a process.**

---

If you're reading **Designing Data-Intensive Applications**, the next important concepts you will see related to threads are:

- **race conditions**
    
- **locks / mutex**
    
- **latches**
    
- **atomic operations**
    

If you want, I can also explain **how a thread is actually created in Linux (`clone()` / `pthread`) and how the kernel stores it in the PCB** — that’s the **real OS-level implementation**.