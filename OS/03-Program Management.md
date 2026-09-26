> [!abstract] Big Picture  
> A **program** is a passive set of instructions.  
> A **process** is a program **while it is executing**, together with the runtime information required to manage that execution.
> 
> The OS manages processes by creating them, allocating resources, scheduling them on the CPU, pausing/resuming them, and eventually terminating them.

---

## 1. Program vs Process

### Program

A **program** is a set of instructions stored somewhere, such as on disk.

Example:

```c
int main() {
    int a = 10;
    int b = 20;
    printf("%d", a + b);
}
```

Before we execute it, it is just instructions.

It is **passive**.

### Process

When that program is loaded and execution begins, it becomes a **process**.

```text
Program --execute--> Process
```

A useful definition:

> **Process = a program in execution + its current execution state and associated resources.**

The important word is **execution**.

### Easy analogy

A **recipe** is like a program.

A **person actually cooking using that recipe** is like a process.

The recipe itself isn't doing anything.

The cooking activity has:

- current step
    
- ingredients
    
- utensils
    
- time/progress
    
- state
    

Similarly, a process contains information about the current execution of a program.

---

# 2. Why do we need a Process?

A program only tells the CPU:

```text
Instruction 1
Instruction 2
Instruction 3
...
```

But the OS needs much more information to manage an executing program.

For example:

- Where is the process currently executing?
    
- What is its PID?
    
- What registers was it using?
    
- What memory does it own?
    
- What files does it have open?
    
- What is its current state?
    
- What is its priority?
    
- What resources has it been allocated?
    

Therefore, the OS maintains a representation of every process.

---

# 3. Process Representation

The OS needs a data structure representing each process.

This representation contains:

```text
Process
   │
   ├── Code / instructions
   ├── Data
   ├── Stack
   ├── Heap
   └── Process management information
```

The lecture presents the process as being divided into **four major memory sections**, while the OS maintains additional management information about it.

---

# 4. Process Memory Layout

A process is commonly represented using these sections:

```text
High Address
┌─────────────────────┐
│       Stack         │
│                     │
│ local variables     │
│ function parameters │
│ function call data  │
├─────────────────────┤
│        Heap         │
│                     │
│ dynamic allocation  │
├─────────────────────┤
│        Data         │
│                     │
│ global variables    │
│ static variables    │
├─────────────────────┤
│        Text         │
│                     │
│ program instructions│
└─────────────────────┘
Low Address
```

> [!important]  
> **Text = instructions**
> 
> **Data = global/static data**
> 
> **Heap = dynamically allocated memory**
> 
> **Stack = function calls, parameters, local variables**

---

# 5. Text Section

The **text section** contains the program's executable instructions.

Example:

```c
int main() {
    int a = 10;
    int b = 20;
    printf("%d", a + b);
}
```

The machine instructions generated from this source code belong to the **text/code section**.

Think:

```text
Text
 ↓
"What should the CPU execute?"
```

It contains the instructions, not the temporary runtime data.

---

# 6. Data Section

The data section contains variables whose lifetime is associated with the program.

The lecture particularly discusses:

- global variables
    
- static variables
    

Example:

```c
int global = 10;

int main() {
    static int count = 0;
}
```

These belong to the data-related part of the process's memory.

### Important idea

Their lifetime is not limited to a single function call.

They exist while the program/process is running.

---

# 7. Heap

The heap is used for **dynamic memory allocation**.

Example:

```c
int *p = malloc(100 * sizeof(int));
```

The required amount of memory may not be known beforehand.

It may be requested during runtime.

```text
Program starts
     ↓
Runtime
     ↓
"Need more memory"
     ↓
Heap allocation
```

So remember:

> **Heap = runtime/dynamic memory allocation**

---

# 8. Stack

The stack is mainly associated with function execution.

For example:

```c
void foo(int x) {
    int y = 10;
}
```

When `foo()` is called, information associated with that function call is placed on the stack.

This includes things such as:

- local variables
    
- function parameters
    
- return information
    
- function-call-related data
    

Example:

```text
main()
  │
  └── foo()
        │
        ├── x
        ├── y
        └── return information
```

When `foo()` finishes, its stack frame can be removed.

---

# 9. Why separate the memory into sections?

Think of a house.

Different rooms have different purposes:

```text
Kitchen      → cooking
Bedroom      → sleeping
Living room  → living
```

Similarly, different parts of a process's memory have different purposes:

```text
Text   → instructions
Data   → global/static data
Heap   → dynamic allocation
Stack  → function execution
```

This separation makes the process easier for the OS and hardware to manage.

---

# 10. One Process = Its Own Memory Representation

Suppose we have:

```text
P1
P2
P3
```

Each process has its own logical process representation.

```text
P1 → Text + Data + Heap + Stack

P2 → Text + Data + Heap + Stack

P3 → Text + Data + Heap + Stack
```

They are separate processes.

This separation is important for **protection**.

A process should not normally be able to arbitrarily access another process's memory.

---

# 11. Process Operations

The OS performs several operations on processes.

### 1. Process Creation

The OS can create a new process.

```text
Process creation
      ↓
New process
```

When a process is created, the OS needs to establish its memory and management information.

---

### 2. Resource Allocation

A process may need resources such as:

- memory
    
- CPU time
    
- I/O devices
    
- files
    

The OS manages these resources.

```text
Process
   │
   ├── memory
   ├── CPU
   ├── files
   └── I/O
```

---

### 3. Scheduling

A process can be scheduled to run on the CPU.

```text
Ready processes

P1
P2
P3
 ↓
CPU scheduler
 ↓
CPU
```

---

### 4. Waiting / Blocking

A process may need to wait for an event.

For example:

```text
Process
   ↓
waiting for I/O
   ↓
Blocked
```

It cannot continue until the required event occurs.

---

### 5. Wake Up / Resume

Once the event happens:

```text
Blocked
   ↓
event occurs
   ↓
Ready
```

The process can eventually run again.

---

### 6. Suspend

The OS may temporarily suspend a process.

```text
Running
   ↓
Suspended
```

Later it can be resumed.

---

### 7. Termination

When the process finishes:

```text
Running
   ↓
Completed
   ↓
Terminated
```

Its resources can then be released.

---

# 12. Process Attributes

The OS needs information about every process.

Examples include:

- Process ID (PID)
    
- process state
    
- program counter
    
- CPU registers
    
- memory information
    
- scheduling information
    
- priority
    
- resource information
    
- list of files/resources being used
    

Think of this as the process's **profile**.

---

# 13. PID — Process ID

When a process is created, the OS assigns it a unique identifier.

```text
P1 → PID 101
P2 → PID 102
P3 → PID 103
```

The PID allows the OS to uniquely identify a process.

For example:

```text
PID = 102
```

means:

> "I'm talking about this particular process."

---

# 14. Process State

A process can be in different states.

The exact state model can vary, but the basic idea is:

```text
        ┌─────────┐
        │  Ready  │
        └────┬────┘
             │
             ↓
        ┌─────────┐
        │ Running │
        └────┬────┘
          ↙       ↘
       I/O         exit
        ↓            ↓
   ┌─────────┐   Terminated
   │ Blocked │
   └────┬────┘
        │
     I/O done
        │
        ↓
      Ready
```

The **current state** tells the OS what the process is currently doing.

---

# 15. Open Files / Resources

Suppose a media player process is running:

```text
Media Player
      │
      ├── movie.mp4
      ├── audio.mp3
      └── subtitles.srt
```

The OS needs to know which files/resources the process is currently using.

Therefore, process management information can contain references to resources associated with that process.

---

# 16. PCB — Process Control Block

This is one of the **most important concepts in this lecture**.

> [!important]  
> **PCB = Process Control Block**

The PCB is a data structure maintained by the operating system containing information needed to manage a process.

You can think of it as:

> **The OS's record/profile of a process.**

Conceptually:

```text
PCB for P1
┌─────────────────────────┐
│ PID                     │
│ Process State           │
│ Program Counter         │
│ CPU Registers           │
│ Scheduling Information  │
│ Memory Information      │
│ Resource Information    │
│ Open Files              │
│ ...                     │
└─────────────────────────┘
```

Every process has its own PCB.

```text
P1 → PCB1
P2 → PCB2
P3 → PCB3
```

---

# 17. Why does the OS need the PCB?

Imagine this:

```text
P1 is running
       ↓
P1 gets interrupted
       ↓
P2 runs
       ↓
Later P1 must continue
```

The OS needs to remember **exactly where P1 stopped**.

Otherwise, P1 would have to start from the beginning.

The PCB provides the information necessary to preserve the process's execution state.

---

# 18. CPU Registers and the PCB

The CPU has registers.

Some important ones discussed in the lecture include:

- PC — Program Counter
    
- IR — Instruction Register
    
- GPRs — General Purpose Registers
    
- SP — Stack Pointer
    

The CPU needs these registers to execute a process.

For example:

```text
CPU

PC  → current instruction information
IR  → current instruction
GPR → general-purpose values
SP  → stack information
```

While a process is running, these registers contain values associated with that process.

---

# 19. The important question: Where does the process resume?

Suppose:

```text
P1 is running

Instruction 1
Instruction 2
Instruction 3
Instruction 4  ← stopped here
Instruction 5
```

The OS must remember the state corresponding to this point.

The relevant CPU register values are saved as part of the process's saved context.

Conceptually:

```text
CPU registers
     │
     │ save
     ↓
PCB of P1
```

Later:

```text
PCB of P1
     │
     │ restore
     ↓
CPU registers
```

Then P1 can continue from its previous execution state.

---

# 20. Context

This gives us another important term:

> **Context = the information representing the current execution state of a process.**

It includes things such as:

- program counter
    
- CPU register values
    
- other execution-related state
    

A simple mental model:

```text
Context
   =
"Where was this process,
and what was the CPU state
when it stopped?"
```

The lecture refers to the collection of relevant PCB values as the process's **context**.

---

# 21. Context Switching

Now we reach one of the most important concepts.

Suppose:

```text
P1 is running on CPU
```

The OS decides:

> Stop P1 and run P2.

It must do two things:

### Step 1 — Save P1's context

```text
CPU
 ↓
P1's register values
 ↓
PCB1
```

### Step 2 — Load P2's context

```text
PCB2
 ↓
P2's saved register values
 ↓
CPU
```

Then:

```text
CPU
 ↓
P2 running
```

This entire process is called a:

> **Context Switch**

---

# 22. Context Switch — Mental Model

Remember it like changing drivers in a car.

Driver A is driving.

```text
CPU
 ↓
Driver A / P1
```

Driver A gets out and stores where they were.

```text
Save P1 context
```

Driver B gets in with their previous settings.

```text
Restore P2 context
```

Now:

```text
CPU
 ↓
P2
```

The CPU didn't "forget" P1.

The OS saved P1's execution state so it can be restored later.

---

# 23. Context Switch in one diagram

```text
                 CPU
                  │
                  │
               P1 running
                  │
          save P1 context
                  │
                  ↓
               PCB1
                  │
                  │
          load P2 context
                  ↑
                  │
               PCB2
                  │
                  ↓
               P2 running
```

Or simply:

```text
P1
 ↓
SAVE CONTEXT
 ↓
LOAD P2 CONTEXT
 ↓
P2
```

---

# 24. Why does context switching happen?

There can be multiple reasons.

For example:

- process finishes its CPU time
    
- process blocks for I/O
    
- higher-priority process needs CPU
    
- interrupt occurs
    
- scheduling decision is made
    
- process is preempted
    

The exact reason depends on the OS and scheduling mechanism.

---

# 25. Dispatch

The lecture introduces the idea of a **dispatcher**.

A dispatcher is the OS component responsible for giving CPU control to the process selected by the scheduler.

Think:

```text
Processes
   ↓
Scheduler
   ↓
"Who should run?"
   ↓
Dispatcher
   ↓
CPU
```

### Scheduler vs Dispatcher

This distinction is worth remembering:

**Scheduler**

> Decides **which process** should run.

**Dispatcher**

> Performs the work needed to **give the CPU to that selected process**.

Simple analogy:

```text
Scheduler:
"Next, P2 should go."

Dispatcher:
"Okay, stop P1, restore P2's context,
and give the CPU to P2."
```

---

# 26. Preemptive Scheduling

The lecture introduces **preemptive** execution.

Suppose P1 is running:

```text
P1 ███████████████
```

Even though P1 hasn't finished, the OS can take the CPU away:

```text
P1 ██████
          ↓
        STOP
          ↓
P2       ███████
```

This is **preemption**.

> **Preemptive = the OS can forcibly take the CPU away from a running process.**

The process does not have to voluntarily give up the CPU.

---

# 27. Non-Preemptive Scheduling

In non-preemptive execution, the running process keeps the CPU until it:

- finishes
    
- blocks
    
- or voluntarily gives up the CPU
    

Conceptually:

```text
P1 ███████████████████
                      ↓
                   finishes
                      ↓
P2                    █████
```

The OS doesn't forcibly interrupt P1 merely because another process is waiting.

---

# 28. Preemptive vs Non-Preemptive

||Preemptive|Non-preemptive|
|---|---|---|
|Can OS forcibly take CPU?|Yes|No|
|Process must finish/block voluntarily?|No|Generally yes|
|Context switches can happen due to scheduler intervention?|Yes|More limited|
|Useful for responsive multitasking?|Yes|Less responsive in some workloads|

### Easy memory trick

**Preemptive**

> "OS can say: **Give me the CPU now.**"

**Non-preemptive**

> "You keep it until **you give it up**."

---

# 29. How everything connects

Now connect the entire lecture:

```text
PROGRAM
  │
  │ starts executing
  ↓
PROCESS
  │
  ├── Text
  ├── Data
  ├── Heap
  └── Stack
  │
  ↓
OS creates PCB
  │
  ├── PID
  ├── State
  ├── PC
  ├── Registers
  ├── Scheduling information
  ├── Memory information
  └── Resource information
  │
  ↓
Scheduler decides
which process should run
  │
  ↓
Dispatcher gives CPU
to that process
  │
  ↓
PROCESS RUNS
  │
  ├── continues
  ├── blocks
  ├── gets preempted
  └── terminates
  │
  ↓
Context may be saved
  │
  ↓
Another process runs
```

---

# 30. The most important mental model

If you remember only one thing from this lecture, remember this:

```text
                OPERATING SYSTEM
                       │
          manages processes
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
         Process 1           Process 2
             │                   │
            PCB                 PCB
             │                   │
       saved context      saved context
             │                   │
             └─────────┬─────────┘
                       ↓
                      CPU
                       │
                one runs at a time
                       │
                 context switch
                       │
                       ↓
                another process
```

The OS makes many processes **appear to run concurrently** by managing CPU time and saving/restoring their execution state.

---

# 31. Important Definitions

### Program

> A passive set of instructions.

### Process

> A program in execution, together with its execution state and associated resources.

### PCB

> A data structure maintained by the OS containing information required to manage a process.

### PID

> A unique identifier assigned to a process.

### Context

> The execution state of a process, including relevant CPU/register information.

### Context Switch

> Saving the context of one process and restoring the context of another.

### Scheduler

> Selects which process should run.

### Dispatcher

> Transfers CPU control to the process selected by the scheduler.

### Preemption

> Forcibly taking the CPU away from a running process.

---

# 32. Common Confusions

## Program ≠ Process

```text
Program = instructions
Process = executing instance
```

The same program can have multiple processes.

For example, opening the same application multiple times can result in multiple execution instances depending on the application/OS.

---

## PCB ≠ Process

The PCB is **not the process itself**.

Think:

```text
Process = actual execution + memory/resources

PCB = OS's record used to manage that process
```

---

## PCB ≠ CPU registers

Registers physically exist inside the CPU.

PCB exists in memory managed by the OS.

But the PCB can contain **saved copies of register values**.

```text
CPU
┌──────────────┐
│ Registers    │
└──────────────┘
       │
       │ save
       ↓
RAM
┌──────────────┐
│ PCB          │
│ saved values │
└──────────────┘
```

This is the key to understanding context switching.

---

## Scheduler ≠ Dispatcher

```text
Scheduler
"Who should run?"

Dispatcher
"Okay, I'll give the CPU to them."
```

---

# 33. 30-Second Revision

If you come back to this note years later:

> A **program** is a passive set of instructions. When it starts executing, it becomes a **process**. A process has its own memory representation, commonly divided into **text, data, heap, and stack**. The OS maintains a **PCB (Process Control Block)** containing information such as the PID, state, program counter, registers, scheduling information, memory information, and resources. When the CPU switches from one process to another, the OS **saves the current process's context and restores the next process's context**. This is a **context switch**. The **scheduler chooses** the next process, while the **dispatcher transfers CPU control** to it. In **preemptive scheduling**, the OS can take the CPU away from a running process; in non-preemptive scheduling, it generally waits for the process to finish or voluntarily give up the CPU.

---

# 34. Questions Future Me Should Be Able to Answer

If you can answer these without looking at the note, you understand the lecture:

1. What is the difference between a program and a process?
    
2. Why does a program need additional information when it becomes a process?
    
3. What are the four major sections of a process's memory?
    
4. What is stored in the text section?
    
5. What is stored in the data section?
    
6. Why do we need the heap?
    
7. What kind of information is associated with the stack?
    
8. What is a PCB?
    
9. Why does every process need a PCB?
    
10. What is a PID?
    
11. What is process context?
    
12. Why does the OS save register values?
    
13. What happens during a context switch?
    
14. Where is a process's saved context maintained?
    
15. What is the difference between a scheduler and dispatcher?
    
16. What does preemptive mean?
    
17. What does non-preemptive mean?
    
18. Why is context switching necessary for multitasking?
    
19. What happens to P1 when P2 starts running?
    
20. How can P1 continue from where it stopped?
    

---

# One-line memory hook

> **Program → Process → PCB → Context → Context Switch → Scheduler → Dispatcher → CPU**