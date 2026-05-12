## ==what is Data?==
Data is a collection of raw facts, values, or symbols that by themselves may not have clear meaning.  
Example: `101`, `John`, `45`, `A`
## ==What is information?==
Information is processed or organized data that has meaning and is useful.  
Example: `John scored 45 marks`
## ==What is Database?==
A database is an organized collection of related data stored in a structured way so it can be easily accessed, managed, and updated.  
Example: Student records in a college system.
## ==What is DBMS(Database Management Systems)?==
DBMS is software used to create, store, manage, retrieve, and control databases efficiently.  
Example: MySQL, Oracle, PostgreSQL, MongoDB.

![[DBMS.webp]]

## DBMS vs File Systems
### Disadvantages of using File Systems

1. **Data Redundancy** : Same data may be stored in multiple files.
2. **Data Inconsistency** : Duplicate data can create mismatched values.
3. **Difficult Data Access** : Searching and updating data is slow.
4. **Poor Security** : Limited control over who can access files.
5. **No Data Relationships** : Hard to connect related data.
6. **No Concurrency Control** : Multiple users can cause conflicts.
7. **Backup & Recovery Issues** : Recovery after crash is difficult.
8. **High Maintenance** : Managing many files becomes complex.
9. **Lack of Atomicity** : If a system fails during an update, changes may be only partially completed, causing incomplete data.  
    Example: Money deducted from one account but not added to another.
10. **Integrity Problems** : File systems cannot easily enforce rules/constraints, so invalid or inconsistent data may enter.  
    Example: Student age entered as `-5` or duplicate roll numbers.

---

## ==DBMS architecture==

### what is view of data?
View of data means how different users see the same database in different ways according to their needs. Users do not need to see the complete database, only the required part.

Example:

- **Student** sees marks and attendance.
- **Teacher** sees marks, attendance, and can update records.
- **Admin** sees all student details.

This is called **data abstraction** because complex database details are hidden from users.
### ==Three Schema Design==

DBMS uses three-level architecture:

1. **Physical Level (Internal Schema)**  
    Describes how data is actually stored in memory/disk.  
    Example: files, indexes, storage blocks.
2. **Logical Level (Conceptual Schema)**  
    Describes what data is stored and relationships between data.  
    Example: Student table, Course table, marks relation.
3. **View Level (External Schema)**  
    Describes how users see data. Different users get different views.  
    Example: Student sees marks only, admin sees full record.

![[ELT-diagram.png]]
