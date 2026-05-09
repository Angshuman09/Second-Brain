
Reliability means a system continues to work correctly even when things go wrong.

## ==A reliable system should:==

- Do what the user expects
- Handle user mistakes properly
- Maintain good performance under load
- Prevent unauthorized access

## ==Fault vs Failure==

**Fault**  
Problem in a component  
Example: server crash, bug

**Failure**  
System stops working for user

**Key idea**  
Fault can happen, but should not become failure

## ==Fault Tolerance==

System continues working even if faults occur

Example  
Instagram still works even if one server fails

## ==Testing Failures==

***Chaos Monkey***  
Randomly breaks system to test reliability

> an open-source, [chaos engineering tool](https://www.google.com/search?client=safari&rls=en&q=chaos+engineering+tool&ie=UTF-8&oe=UTF-8&ved=2ahUKEwic9cjgiouUAxVXS2wGHdMLKN4QgK4QegYIAQgAEAQ) developed by [Netflix](https://www.google.com/search?client=safari&rls=en&q=Netflix&ie=UTF-8&oe=UTF-8&ved=2ahUKEwic9cjgiouUAxVXS2wGHdMLKN4QgK4QegYIAQgAEAU) that randomly terminates production instances or containers to ensure system resilience

---
 
 ## ==Hardware Faults==

- Physical components fail: disk crash, RAM fault, power outage, cable unplug
    
- Failures are **common at scale** (e.g., 10,000 disks → ~1 failure/day)
    
- Measured using **MTTF (Mean Time To Failure)**
    

### Solution:

- Add **redundancy**:
    
    - RAID (multiple disks)
        
    - Dual power supply
        
    - Backup generators
        
- System keeps running even if one component fails
    

---

##  ==Software Errors==

- Not random → **systematic & correlated**
    
- Can crash many systems at once
    

### Examples:

- Bug triggered by specific input
    
- Resource exhaustion (CPU, RAM, etc.)
    
- Dependency failure (slow/unresponsive service)
    
- Cascading failures (one failure → chain reaction)
    

### Handling:

- Testing (unit + integration)
    
- Monitoring & logging
    
- Process isolation (crash & restart)
    
- Self-checking systems (detect inconsistencies)
    

---

##  ==Human Errors==

- Humans = **biggest cause of failures**
    
- More than hardware in many cases
    

### Examples:

- Wrong config changes
    
- Misuse of systems
    

### Solutions:

- Good design → easy to do right, hard to do wrong
    
- Use **sandbox environments** (safe testing)
    
- Strong testing (especially edge cases)
    
- Easy rollback & gradual deployment
    
- Monitoring (metrics, alerts)
    
- Training & good practices
    

---
