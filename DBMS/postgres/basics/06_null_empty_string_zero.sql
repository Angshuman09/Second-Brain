

DROP TABLE IF EXISTS basics.value_examples;

CREATE TABLE basics.value_examples(
  id SERIAL PRIMARY KEY,
  nickname TEXT,
  bio TEXT,
  score INT
);

INSERT INTO basics.value_examples (nickname, bio, score)

VALUES
(null, 'learning postgres', 10),
('', 'my name is angshu', 5),
('Angshu','', 0),
('wamiqa', null, null);

-- SELECT * FROM basics.value_examples;

SELECT * FROM basics.value_examples WHERE nickname IS NULL;
SELECT * FROM basics.value_examples WHERE nickname='';
