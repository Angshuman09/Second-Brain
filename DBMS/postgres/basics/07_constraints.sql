
DROP TABLE IF EXISTS basics.account;

CREATE TABLE basics.account(
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  age INTEGER CHECK (age>=18),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.account (full_name, email, age)

VALUES ('angshuman kashyap', 'angshu@gmail.com', 21);

SELECT * FROM basics.account;
