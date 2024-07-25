const { initializeClient } = require('../config/cassandraClient');
const { v4: uuidv4 } = require('uuid');

//return all products
const getProducts = async (req, res) => {
    const client = await initializeClient();

    try {
        const query = 'SELECT * FROM test_keyspace.products'; //update keyspace

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

//return all products partitioned by category
const getProductsByCategory = async (req, res) => {
    const client = await initializeClient();

    try {
        const query = 'SELECT * FROM test_keyspace.products_by_category'; //update keyspace

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

//return all products partitioned by warehouse
const getProductsByWarehouse = async (req, res) => {
    const client = await initializeClient();

    try {
        const query = 'SELECT * FROM test_keyspace.products_by_warehouse'; //update keyspace

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

//return all transactions partitioned by date
const getTransactionsByDate = async (req, res) => {
    const client = await initializeClient();

    try {
        const query = 'SELECT * FROM test_keyspace.transactions_by_date'; //update keyspace

        client.execute(query)
            .then(result => res.status(200).json(result.rows))
            .catch(e => console.log(`${e}`));
    } catch (error) {
        console.error(`Error in getTransactionsByDate: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

//return all stocks partitioned by product name
const getProductsByQuantity = async (req, res) => {
    const client = await initializeClient();

    try {
        const query = 'SELECT * FROM test_keyspace.stocks_by_quantity'; //update keyspace

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
    const client = await initializeClient();

    const { product_category, product_name, cost_price, quantity_in_stock, warehouse_location, warehouse_name } = req.body;
    const product_id = uuidv4();
    const delivery_date = new Date();
    const warehouse_id = uuidv4();

    const insertProductQuery = `
    INSERT INTO test_keyspace.products (product_id, product_category, product_name, cost_price, quantity_in_stock, warehouse_id, warehouse_location, delivery_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const insertProductByCategoryQuery = `
    INSERT INTO test_keyspace.products_by_category (product_category, product_name, product_id)
    VALUES (?, ?, ?)
  `;
    const insertProductByWarehouseQuery = `
    INSERT INTO test_keyspace.products_by_warehouse ( warehouse_name, warehouse_id, product_name, warehouse_location, product_id)
    VALUES (?, ?, ?, ?, ?)
  `;
    const insertStocksByQuantityQuery = `
    INSERT INTO test_keyspace.stocks_by_quantity (product_category, product_name, product_id, quantity_in_stock)
    VALUES (?, ?, ?, ?)
  `;

    const queries = [
        { query: insertProductQuery, params: [product_id, product_category, product_name, cost_price, quantity_in_stock, warehouse_id, warehouse_location, delivery_date] },
        { query: insertProductByCategoryQuery, params: [product_category, product_name, product_id] },
        { query: insertProductByWarehouseQuery, params: [warehouse_name, warehouse_id, product_name, warehouse_location, product_id] },
        { query: insertStocksByQuantityQuery, params: [product_category, product_name, product_id, quantity_in_stock] },
    ];

    try {
        await client.batch(queries, { prepare: true, consistency: cassandra.types.consistencies.localQuorum });
        res.status(201).send('Product created successfully');
    } catch (error) {
        console.error(`Error in insertProduct: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

//add new transaction when product is sold
const addNewTransaction = async (req, res) => {
    const client = await initializeClient();

    try {
        const query = 'INSERT INTO test_keyspace.transactions_by_date (transaction_date, transaction_id, product_name, product_id) VALUES (?, ?, ?, ?)'; //update keyspace

        client.execute(query, [transaction_date, transaction_id, product_name, product_id])
            .then(result => res.status(200).json(result.rows))
            .catch(e => console.log(`${e}`));
    } catch (error) {
        console.error(`Error in addNewTransaction: ${error}`);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.shutdown();
    }
};

//update stock quantity
const updateStockQuantity = async (req, res) => {
    const client = await initializeClient();
    const { product_id, new_quantity, product_name, product_category } = req.body;

    const updateProductsQuery = `
        UPDATE test_keyspace.products
        SET quantity_in_stock = ?
        WHERE product_id = ? AND product_category = ? AND product_name = ?;
    `;

    const updateStocksByQuantityQuery = `
        UPDATE test_keyspace.stocks_by_quantity
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
    getProductsByCategory,
    getProductsByWarehouse,
    getTransactionsByDate,
    getProductsByQuantity,
    insertProduct,
    addNewTransaction,
    updateStockQuantity,
};