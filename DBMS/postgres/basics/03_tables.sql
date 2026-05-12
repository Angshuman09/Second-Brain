

CREATE TABLE basics.students(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email  TEXT NOT NULL UNIQUE,
  age INTEGER CHECK(age>=18),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.students (name, email, age)
VALUES
      ('Angshu', 'angshu@gmail.com', 21),
      ('Wamiqa', 'wamiqa@gmail.com', 22);
