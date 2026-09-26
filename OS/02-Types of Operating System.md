## Main Memory Layout

Before executing any program, the process must reside in **Main Memory (RAM)**. Main memory is partitioned into two primary sections:

- **Kernel Space (OS Space):** Reserved exclusively for the core operating system code, system drivers, and data structures.
    

- **User Space:** Allocated for user applications and executing processes.
    
![[memory_layout.webp]]

## Uniprogramming Operating System

An operating system that allows only **one user process** to reside in main memory at any given time alongside the OS.

![[uniprogramming.png]]

### Execution Behavior

- Process $P1$ alternates between CPU execution and I/O operations.
    
      
    
- When $P1$ requests an I/O operation, the CPU sits **idle** because no other process is loaded in memory.
    
      
    
- **Major Drawback:** Extremely low CPU utilization.
    
      
    

## Multiprogramming Operating System

To overcome CPU idling, a **Multiprogramming OS** keeps **multiple processes** in main memory simultaneously.

![[multiprogramming.png]]

### Execution Mechanism

1. CPU executes process $P1$.
    
      
    
2. When $P1$ leaves the CPU to perform an I/O operation, the OS immediately context-switches the CPU to execute process $P2$.
    
      
    
3. When $P2$ goes for I/O, CPU switches to $P3$, maximizing overall **CPU Utilization**.
    
      
    

### Degree of Multiprogramming

- **Definition:** The total number of processes residing in main memory at any given time.
    
      
    
- Increasing the degree of multiprogramming increases CPU utilization **up to an optimal limit**. Beyond this limit, performance degrades due to thrashing.
    
![[degreeofmultiprogramming.png]]

### Preemptive vs. Non-Preemptive Multiprogramming

- **Non-Preemptive:** Once a process is allocated to the CPU, it cannot be taken away forcefully. The process releases the CPU only when it terminates or requests an I/O operation.
    
      
    
- **Preemptive:** The OS can forcefully remove a process from the CPU (e.g., when a higher-priority process arrives or a time slice expires).
    
      
    

## Multitasking (Time-Sharing) Operating System

Multitasking is a logical extension of **Preemptive Multiprogramming** using **Round-Robin Scheduling**.

  

```
             [ Excalidraw Diagram Blueprint: Time-Sharing ]

             [ Ready Queue ] ───>  P1  ───>  P2  ───>  P3
                                   │         │         │
                                   v         v         v
                              ┌────────────────────────┐
                              │     CPU EXECUTION      │
                              ├────────────────────────┤
                              │ P1 ──> P2 ──> P3 ──> P1│  <-- Time Slice (Quantum)
                              └────────────────────────┘
                                           │
                                           v
                               (Illusion of Concurrency)
```

### Key Properties

- CPU execution time is split into tiny fixed intervals called **Time Quantum** (or Time Slice).
    
      
    
- The OS switches between processes so rapidly that users experience seamless concurrent execution.
    
      
    
- **Primary Goal:** Minimize response time and enable user interactivity.
    
      
    

## Multiuser Operating System

Allows multiple users to simultaneously access and share a single central computing system (CPU, RAM, Hard Disk) through independent physical or logical terminals.

  

```
             [ Excalidraw Diagram Blueprint: Multiuser Setup ]

        [ Terminal 1 ]       [ Terminal 2 ]       [ Terminal 3 ]
       (Monitor/Keybd)      (Monitor/Keybd)      (Monitor/Keybd)
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  │
                                  v
                    ┌───────────────────────────┐
                    │     CENTRAL HARDWARE      │
                    │   (Single CPU, RAM, OS)   │
                    └───────────────────────────┘
```

- **Terminals:** Peripheral setups (Monitor, Keyboard, Mouse) connected to the main computer.
    
      
    
- **Examples:** Unix, Linux (Standard desktop Windows is a single-user OS).
    
      
    

## Multiprocessing Operating System

A computer architecture featuring **two or more physical CPUs (Processors)** executing instructions in parallel.

  

```
        [ Excalidraw Blueprint: Multiprocessing Architectures ]

 ┌────────────────────────────────────┐  ┌────────────────────────────────────┐
 │  Tightly-Coupled (Shared Memory)   │  │   Loosely-Coupled (Distributed)    │
 ├────────────────────────────────────┤  ├────────────────────────────────────┤
 │                                    │  │                                    │
 │  ┌──────┐    ┌──────┐    ┌──────┐  │  │  ┌──────┐    ┌──────┐    ┌──────┐  │
 │  │ CPU1 │    │ CPU2 │    │ CPU3 │  │  │  │ CPU1 │    │ CPU2 │    │ CPU3 │  │
 │  └──┬───┘    └──┬───┘    └──┬───┘  │  │  └──┬───┘    └──┬───┘    └──┬───┘  │
 │     │           │           │      │  │     │           │           │      │
 │     └───────────┼───────────┘      │  │  ┌──┴───┐    ┌──┴───┐    ┌──┴───┐  │
 │                 │                  │  │  │ RAM1 │    │ RAM2 │    │ RAM3 │  │
 │                 v                  │  │  └──┬───┘    └──┬───┘    └──┬───┘  │
 │    ┌──────────────────────────┐    │  │     │           │           │      │
 │    │    SHARED MAIN MEMORY    │    │  │     └─────<=====>─────<=====>      │
 │    └──────────────────────────┘    │  │        [ Network Bus ]             │
 └────────────────────────────────────┘  └────────────────────────────────────┘
```

### Types

1. **Tightly-Coupled System (Shared Memory):**
    
      
    - Processors share a single common main memory and clock.
        
          
        
    - Controlled under one operating system instance.
        
          
        
2. **Loosely-Coupled System (Distributed Memory):**
    
      
    - Each processor has its own local memory block.
        
          
        
    - Processors communicate across a high-speed communication network.
        
          
        

## Embedded Operating System

Operating systems tailored for microcontrollers inside specialized machines (e.g., Washing Machines, Air Conditioners, Automobile ICs).

  

- Designed for dedicated, fixed tasks.
    
      
    
- Extremely compact, highly reliable, and resource-constrained.
    
      
    
- **Minimal to zero direct user interaction** with the underlying OS.
    
      
    

## Real-Time Operating System (RTOS)

Designed for environments where incoming data/events must be processed within strict, deterministic **deadlines**.

  

```
                [ Excalidraw Diagram Blueprint: RTOS Types ]

                           ┌─────────────────┐
                           │   Real-Time OS  │
                           └────────┬────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  │                                   │
                  v                                   v
        ┌───────────────────┐               ┌───────────────────┐
        │   Hard Real-Time  │               │   Soft Real-Time  │
        ├───────────────────┤               ├───────────────────┤
        │ • Absolute zero   │               │ • Minor deadline  │
        │   deadline delay  │               │   delay allowed   │
        │ • Miss = System   │               │ • Miss = Quality  │
        │   Failure         │               │   degradation     │
        │ • E.g., Rocket    │               │ • E.g., Video     │
        │   Launch Systems  │               │   Streaming       │
        └───────────────────┘               └───────────────────┘
```

## Handheld Device Operating System

Operating systems designed specifically for mobile, battery-powered portable hardware (smartphones, tablets).

  

- Optimized for touch interfaces, power management, and wireless networking.
    
      
    
- **Examples:** Android, iOS.