
Most cost of software is after development (maintenance)

---

## ==What is maintenance?==

- fixing bugs
    
- handling failures
    
- adding features
    
- adapting to new needs
    
- dealing with legacy code
    

---

## Goal

> Design systems so they are easy to maintain in future

---

## 3 Principles

### Operability

Easy to run and manage system

Example

- monitoring
    
- logs
    
- easy debugging
    

---

### Simplicity

System should be easy to understand

- avoid unnecessary complexity
    
- helps new developers
    

---

### Evolvability

Easy to change and extend system

- add new features
    
- adapt to new requirements
    

---

## ==Operability: Making Life Easy for Operations==

Make system easy to run, manage, and fix

---

## Important idea

> Good operations can handle bad software  
> But good software cannot survive bad operations

---

## What operations team does

- monitor system health
    
- fix failures quickly
    
- find root cause of issues
    
- update system (security, patches)
    
- plan for future load
    
- handle deployments and configs
    
- maintain system stability
    

---

## Goal

> Make routine work easy so humans can focus on important problems

---

## How to achieve operability

- good monitoring and visibility
    
- easy automation
    
- system keeps running even if one machine fails
    
- clear documentation
    
- predictable behavior
    
- support both automation and manual control
    

---

## ==Simplicity: Managing Complexity==

As systems grow, they become complex -> hard to understand and maintain

---

## What is the problem?

Complex systems cause:

- hard to understand code
    
- more bugs
    
- slower development
    
- difficult changes
    

This is often called  
“big ball of mud”

---

## Signs of complexity

- tightly connected modules
    
- messy dependencies
    
- inconsistent naming
    
- hacks and quick fixes
    
- too many special cases
    

---

## Important idea

> More complexity = more bugs and maintenance cost

---

## Goal

> Reduce complexity to make system easier to work with

---

## Accidental vs Real complexity

Real complexity  
Comes from the problem itself

Accidental complexity  
Comes from bad design or implementation

---

## Key tool: Abstraction

> Hide complex details behind simple interface

---

## Examples of abstraction

- Programming languages hide machine code
    
- SQL hides how data is stored internally
    

---

## Why abstraction helps

- easier to understand
    
- reusable
    
- less duplication
    
- better quality
    

---

## ==Evolvability: Making Change Easy==

Systems should be easy to change over time

---

## Why change is needed

Requirements always change:

- new features
    
- new user needs
    
- business changes
    
- scaling issues
    
- new technologies
    
- legal changes
    

---

## How it is achieved

- simple design
    
- good abstractions
    
- loosely coupled components
    

---

## Real insight

Complex systems are hard to change  
Simple systems are easier to evolve

---

## Connection

Evolvability depends on:

- simplicity
    
- good abstractions
    

---

## Example idea

Changing system architecture (like Twitter timeline approach)  
Should be possible without breaking everything

---