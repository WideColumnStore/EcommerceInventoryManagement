
CREATE TABLE IF NOT EXISTS products_by_category(
product_category TEXT,
product_name TEXT,
product_id UUID,
PRIMARY KEY ((product_category),product_id ))
WITH CLUSTERING ORDER BY (product_id ASC);

CREATE TABLE IF NOT EXISTS stocks_by_quantity (
    product_category TEXT,
    quantity_in_stock BIGINT,
    product_name TEXT,
    product_id UUID,
    PRIMARY KEY ((product_category), product_name)
) WITH CLUSTERING ORDER BY (product_name ASC);

CREATE TABLE IF NOT EXISTS products_by_warehouse (
    warehouse_name TEXT,
    product_name TEXT,
    warehouse_location TEXT,
    product_id UUID,
    warehouse_id UUID,
    PRIMARY KEY ((warehouse_name), warehouse_id, product_name)
) WITH CLUSTERING ORDER BY (warehouse_id ASC, product_name ASC);

CREATE TABLE IF NOT EXISTS products (
    product_id UUID,
    product_category TEXT,
    product_name TEXT,
    cost_price DECIMAL,
    quantity_in_stock BIGINT,
    warehouse_id UUID,
    warehouse_location TEXT,
    delivery_date DATE,
    PRIMARY KEY ((product_id), product_category, product_name)
) WITH CLUSTERING ORDER BY (product_category ASC, product_name ASC);