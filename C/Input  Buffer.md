## <span style="color:#9cca39;">Day-1</span>
### <span style="color:lightblue;">Input buffer header file</span>

```c
typedef struct {
    char* buffer;
    size_t buffer_length;
    ssize_t input_length;
} InputBuffer;
```

-  **<span style="color:pink; font-weight:bold;">char* buffer</span> means buffer will points to memory containing the user's input.**

Suppose the user types

```
hello
```

Memory might look like

```
+---+---+---+---+---+---+
| h | e | l | l | o |\0 |
+---+---+---+---+---+---+
```

`buffer`

```
buffer
  |
  v
+---+---+---+---+---+---+
| h | e | l | l | o |\0 |
+---+---+---+---+---+---+
```

It's just a pointer to the first character.

- **<span style="color:pink; font-weight:bold;">size_t buffer_length;</span> means how much memory is allocated**.

For example

Suppose

```
malloc(100);
```

Then

```
buffer_length = 100
```

Even if the user only typed

```
hello
```

the buffer still has space for 100 bytes.

Think of it like a notebook.

Notebook capacity

```
100 pages
```

You've only written

```
5 pages
```

Capacity ≠ actual usage.

- **<span style="color:pink; font-weight:bold;">ssize_t input_length;</span> means how many characters the user actually entered**.

Example

User types

```
SELECT
```

Then

```
buffer_length = 100
input_length = 6
```

Notice the difference

```
buffer_length
```

means

```
Allocated space
```

while

```
input_length
```

means

```
Actual characters typed
```

### Declaration functions(will be implement later in .c file)
```c
void print_prompt();
InputBuffer* new_input_buffer();
void read_input(InputBuffer* input_buffer);
void close_input_buffer(InputBuffer* input_buffer);
```

---
---

## <span style="color:lightblue;">Input Buffer .c file</span>

```c
#include <stdio.h>
#include <stdlib.h>
#include "input_buffer.h"
```

### `#include <stdio.h>`

This includes the Standard Input Output library.

It provides functions like

```
printf();
getline();
stdin;
```

Without it, the compiler wouldn't know what these functions are.

---

### `#include <stdlib.h>`

Provides

```
malloc();
free();
exit();
EXIT_FAILURE;
```

You'll notice all of these are used later.

---

### `#include "input_buffer.h"`

This includes **your own header file**.

Now this `.c` file knows

```
InputBuffer
print_prompt()
new_input_buffer()
read_input()
close_input_buffer()
```

Without including it,

```
InputBuffer
```

would be unknown.

---

```c
void print_prompt() {
    printf("db> ");
}
```

print db> whenever the function call

---

```c
InputBuffer* new_input_buffer() {
    InputBuffer* input_buffer = (InputBuffer*)malloc(sizeof(InputBuffer));
    input_buffer->buffer = NULL;
    input_buffer->buffer_length = 0;
    input_buffer->input_length = 0;
    return input_buffer;
}
```
**What it does:**

- Allocates memory for an `InputBuffer` struct using `malloc()`.
- Initializes all fields:
    - `buffer = NULL` (no input yet)
    - `buffer_length = 0` (no memory allocated for the string yet)
    - `input_length = 0` (no characters read yet)
- Returns a pointer to the newly created `InputBuffer`.
---

```c
void read_input(InputBuffer* input_buffer) {
    ssize_t bytes_read = 
    getline(&(input_buffer->buffer), &(input_buffer->buffer_length), stdin);

    if (bytes_read < 0) {
        printf("Error reading input\n");
        exit(EXIT_FAILURE);
    }

    input_buffer->input_length = bytes_read - 1;
    input_buffer->buffer[bytes_read - 1] = 0;

    printf("buffer length: %zu\n", input_buffer->buffer_length);
    printf("input length: %zd\n", input_buffer->input_length);
    printf("Bytes read: %zd\n", bytes_read);
    printf("%s\n", input_buffer->buffer);
}
```

## Function Purpose

Reads a line of input from the keyboard and stores it in the `InputBuffer` structure.

---

## `getline()`

```c
getline(&(input_buffer->buffer),
        &(input_buffer->buffer_length),
        stdin);
```

### Syntax

```c
ssize_t getline(char **lineptr, size_t *n, FILE *stream);
```

### Parameters

### 1. `&(input_buffer->buffer)`

- `buffer` is a `char*` (pointer to the input string).
- We pass **its address** (`char**`) because `getline()` may allocate or reallocate memory and needs to update the pointer.

Example:

```c
char *buffer = NULL;
getline(&buffer, &size, stdin);
```

Before:

```c
buffer → NULL
```

After:

```c
buffer → "Hello World\n"
```

---

### 2. `&(input_buffer->buffer_length)`

- Holds the **capacity** of the allocated buffer.
- `getline()` updates this value if it allocates or resizes memory.

Example:

```
Before: buffer_length = 0
After : buffer_length = 120
```

> **Note:** `buffer_length` is **allocated memory**, **not** the length of the input.

---

### 3. `stdin`

The input source.

- `stdin` → Keyboard
- Could also be a file:

```c
getline(&buffer, &size, file);
```

---

## Return Value

```c
ssize_t bytes_read
```

Returns:

- Number of bytes read (including `\n`)
- `-1` if an error occurs

Example:

```
Input: Hello

Memory:
H e l l o \n \0

bytes_read = 6
```

---

## Error Checking

```
if (bytes_read < 0)
```

If `getline()` returns `-1`, input failed.

```
exit(EXIT_FAILURE);
```

Stops the program with an error.

---

## Removing the Newline

```c
input_buffer->input_length = bytes_read - 1;
```

Subtract `1` because `getline()` includes the newline (`\n`).

---

```c
input_buffer->buffer[bytes_read - 1] = '\0';
```

Replaces the newline with the null terminator.

Before:

```
Hello\n\0
```

After:

```
Hello\0
```

Now the string is clean and easier to compare with functions like `strcmp()`.


```c
void close_input_buffer(InputBuffer* input_buffer) {
    free(input_buffer->buffer);
    free(input_buffer);
}
```
