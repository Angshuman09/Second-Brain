
CREATE TABLE basics.product_basic (
  id SERIAL PRIMARY KEY,

  name VARCHAR(100) NOT NULL,

  description TEXT,

  stock INTEGER DEFAULT 0,

  total_views BIGINT DEFAULT 0,

  price NUMERIC(10, 2),

  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO basics.product_basic
            (name, description, stock, total_views, price, is_active)

VALUES
      (
        'book',
        'this is a good book',
        22,
        100000,
        504,
        true
      ),
      (
        'laptop',
        'this is a good laptop',
        100,
        1000,
        100000,
        true
      ),
      (
        'pen',
        'this is a out of stock pen',
        2,
        1000000,
        50,
        false
      );

SELECT * FROM basics.product_basic;

SELECT id, name, description, price
FROM basics.product_basic
WHERE is_active;
