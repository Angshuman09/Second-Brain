## What is Operating System?

An operating system (OS) is the primary system software that manages a computer's hardware and software resources, acting as a bridge between the user, applications, and physical components.
## Parts of Operating System

![[partsofos.png]]
## System Call

User programs cannot directly access hardware or critical OS resources because it would make the system unstable and insecure. To maintain safety, the operating system provides system calls, controlled interfaces that allow user programs to request services from the kernel. These calls act as a gateway between user mode and kernel mode. System Calls are,

- A way for programs to interact with the operating system.
- Provide the services of the operating system to the user programs.
- Only entry points into the kernel are executed in kernel mode.

Example:

- Opening a file in C (fopen) internally uses system calls like open().
- Running a program in Linux uses fork() and exec() system calls.
- Printing on screen uses the write() system call.
## Dual Mode Operation

**Dual mode operation** means the CPU has **2 modes** to control what code is allowed to do:
![[dualmode.png]]
### Services & Goals

| **Services**                | **Goals**   |
| --------------------------- | ----------- |
| User Interface              | Convenience |
| Program Execution           | Efficiency  |
| I/O Operations              | Portability |
| File-System Manipulation    | Reliability |
| Inter-Process Communication | Scalability |
| Error Detection             | Robustness  |
| Resource Allocation         |             |
| Accounting                  |             |
| Protection & Security       |             |
