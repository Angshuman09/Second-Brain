CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS products;

CREATE TABLE products(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >=0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    sku TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, category, price, stock, sku, description)

VALUES 
      (
    'Wireless Mouse',
    'Electronics',
    799.99,
    25,
    'WM-1001',
    'Ergonomic wireless mouse with USB receiver'
),
(
    'Mechanical Keyboard',
    'Electronics',
    2499.50,
    15,
    'MK-2002',
    'RGB mechanical keyboard with blue switches'
),
(
    'Water Bottle',
    'Home & Kitchen',
    299.00,
    50,
    'WB-3003',
    '1 liter stainless steel insulated bottle'
),
(
    'Notebook Pack',
    'Stationery',
    199.99,
    100,
    'NB-4004',
    'Pack of 5 ruled notebooks for students'
),
(
    'Gaming Headset',
    'Gaming',
    3499.00,
    10,
    'GH-5005',
    'Over-ear gaming headset with surround sound'
);

SELECT name, category, sku, description FROM products

WHERE sku IN ('WM-1001', 'MK-2002', 'WB-3003');
