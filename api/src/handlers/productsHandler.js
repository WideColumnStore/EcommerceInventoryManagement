const { createClient } = require('../config/cassandraClient');
const { v4: uuidv4 } = require('uuid');

//return all products
const getProducts = async (req, res) => {
    const client = await createClient();

    try {
        const query = 'SELECT * FROM products';

        client.execute(query)
            .then(result => res.status(200).json(result.rows))
            .catch(e => console.log(`${e}`));
    } catch (error) {
        console.error(`Error in getProducts: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

// Return count of products in each category
const countProductsInCategories = async (req, res) => {
    const client = await createClient();

    try {
        const query = 'SELECT product_category, COUNT(*) FROM products_by_category GROUP BY product_category';

        client.execute(query)
            .then(result => res.status(200).json(result.rows))
            .catch(e => console.log(`${e}`));
    } catch (error) {
        console.error(`Error in getProductsByCategory: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

// Return count of products in warehouse
const countProductsInWarehouse = async (req, res) => {
    const client = await createClient();

    try {
        const query = 'SELECT warehouse_name, COUNT(*) FROM products_by_warehouse GROUP BY warehouse_name';

        client.execute(query)
            .then(result => res.status(200).json(result.rows))
            .catch(e => console.log(`${e}`));
    } catch (error) {
        console.error(`Error in getProductsByWarehouse: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

// Return all stocks partitioned by product name
const getProductsByQuantity = async (req, res) => {
    const client = await createClient();

    try {
        const query = 'SELECT product_category, SUM(quantity_in_stock) AS Quantity_In_Stock FROM stocks_by_quantity GROUP BY product_category';

        client.execute(query)
            .then(result => res.status(200).json(result.rows))
            .catch(e => console.log(`${e}`));
    } catch (error) {
        console.error(`Error in getProductsByQuantity: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

//add new product
const insertProduct = async (req, res) => {
    const client = await createClient();

    try{
        const array = req.body;
        for(product of array) {
            const { product_category, product_name, cost_price, quantity_in_stock, warehouse_location, warehouse_name } = product;
            const product_id = uuidv4();
            const delivery_date = new Date();
            const warehouse_id = uuidv4();

            const insertProductQuery = `
            INSERT INTO products (product_id, product_category, product_name, cost_price, quantity_in_stock, warehouse_id, warehouse_location, delivery_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const insertProductByCategoryQuery = `
            INSERT INTO products_by_category (product_category, product_name, product_id)
            VALUES (?, ?, ?)
            `;
            const insertProductByWarehouseQuery = `
            INSERT INTO products_by_warehouse ( warehouse_name, warehouse_id, product_name, warehouse_location, product_id)
            VALUES (?, ?, ?, ?, ?)
            `;
            const insertStocksByQuantityQuery = `
            INSERT INTO stocks_by_quantity (product_category, product_name, product_id, quantity_in_stock)
            VALUES (?, ?, ?, ?)
            `;

            const queries = [
                { query: insertProductQuery, params: [product_id, product_category, product_name, cost_price, quantity_in_stock, warehouse_id, warehouse_location, delivery_date] },
                { query: insertProductByCategoryQuery, params: [product_category, product_name, product_id] },
                { query: insertProductByWarehouseQuery, params: [warehouse_name, warehouse_id, product_name, warehouse_location, product_id] },
                { query: insertStocksByQuantityQuery, params: [product_category, product_name, product_id, quantity_in_stock] },
            ];

            await client.batch(queries, { prepare: true });
        }
        
        res.status(201).send('Product created successfully');
    }
    catch (error) {
        console.log("Insertion error");
        res.status(500).send('Internal Server Error');
    }
    finally {
        await client.shutdown();
    }
};

//update stock quantity
const updateStockQuantity = async (req, res) => {
    const client = await createClient();
    const { product_id, new_quantity, product_name, product_category } = req.body;

    const updateProductsQuery = `
        UPDATE products
        SET quantity_in_stock = ?
        WHERE product_id = ? AND product_category = ? AND product_name = ?;
    `;

    const updateStocksByQuantityQuery = `
        UPDATE stocks_by_quantity
        SET quantity_in_stock = ?
        WHERE product_category = ? AND product_name = ?;
    `;

    try {
        await client.execute(updateProductsQuery, [new_quantity, product_id, product_category, product_name]);
        await client.execute(updateStocksByQuantityQuery, [new_quantity, product_category, product_name]);

        res.status(200).send('Stock quantity updated successfully');

    } catch (error) {
        console.error(`Error in updateStockQuantity: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

module.exports = {
    getProducts,
    countProductsInCategories,
    countProductsInWarehouse,
    getProductsByQuantity,
    insertProduct,
    updateStockQuantity,
};