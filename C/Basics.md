### <span style="color:lightpink;">Why we use header gurd in C</span>

It prevents the contents of the header from being processed more than once _in the same translation unit_.

Imagine you have a header file `foo.h` that gets included in your program:

```c
/**
 * main.c
 */
#include "foo.h"

int main( void )
{
  ...
}
```

Now suppose you include a second header, `bar.h`, that _also_ includes `foo.h`:

```c
 /**
  * bar.h
  */
 #include "foo.h"

 /**
  * main.c
  */
 #include "foo.h"
 #include "bar.h"

 int main( void )
 {
   ...
 }
```

When you compile `main.c` the contents of `foo.h` will be processed twice, which can lead to duplicate definition errors.

So we use include guards to prevent this from happening:

```c
#ifndef FOO_H
#define FOO_H

...

#endif
```

So in this scenario, the first time `foo.h` is included `FOO_H` is not defined, so the contents of the header are processed as normal.

The second time it's included `FOO_H` is defined, so the contents of the file are ignored.

This is a convention that developed over the years, it's not an official part of the language.

Some compilers have a preprocessing directive `#pragma once` that does the same thing, but it's not universally supported.

It allows you to include headers anywhere you need them without having to worry about duplicate definitions, or having to worry about the order in which they are included.

---
### <span style="color:lightpink;">What's the use of <span style="color:lightgreen;">&lt;stddef.h&gt;</span> and <span style="color:lightgreen;">&lt;sys/types.h&gt;</span></span>

### <span style="color:#CBC3E3;">stddef.h</span>

Provides

```
size_t
```

`size_t` is an unsigned integer type used for sizes.

Example

```
size_t length = 20;
```

Instead of

```
unsigned long length;
```

because `size_t` automatically matches the platform.

---

### <span style="color:#CBC3E3;">sys/types.h</span>

Provides

```
ssize_t
```

`ssize_t` is a **signed** version of `size_t`.

Why signed?

Because sometimes a function needs to return

- number of bytes read
- **or**
- `-1` if an error occurred.

Example

```
ssize_t bytes = read(...);

if (bytes == -1) {
    printf("Error\n");
}
```

If it were `size_t`, it couldn't represent `-1`.

### <span style="color:lightpink;">What is <span style="color:lightgreen;">getline()?</span></span>

`getline()` is a **library function** that reads an **entire line of text** from an input stream (usually the keyboard or a file).

Its prototype is:

```c
ssize_t getline(char **lineptr, size_t *n, FILE *stream);
```

When you write

```c
getline(&buffer, &buffer_length, stdin);
```

> here buffer is input character and buffer length is how much memory is allocated in the RAM

you're basically telling C:

> "Read one complete line from the keyboard. If I don't have enough memory, allocate or resize it for me."

That's the important part.

Unlike `scanf()` or `fgets()`, **`getline()` manages memory automatically**.