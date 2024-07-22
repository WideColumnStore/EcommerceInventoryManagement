const express = require('express');
const cassandra = require('cassandra-driver');

const app = express();

app.use(express.json());

app.get('/healthcheck', (req, res) => res.send('Server is running'));

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], // TODO configure to deployed cassandra instance
  localDataCenter: 'datacenter1', // TODO configure to actual cassandra data center
  keyspace: 'inventory_management' // TODO configure to deployed keyspace
});

app.get('/products/:product_id', async (req, res) => {
  const productId = req.params.product_id;

  const query = 'SELECT * FROM products WHERE product_id = ?';
  try {
    const result = await client.execute(query, [productId], { prepare: true });
    if (result.rowLength > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/products', async (req, res) => {
  const { product_id, name, description, price, quantity, category, supplier_id, created_at } = req.body;

  const query = 'INSERT INTO products (product_id, name, description, price, quantity, category, supplier_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  try {
    await client.execute(query, [product_id, name, description, price, quantity, category, supplier_id, created_at], { prepare: true });
    res.status(201).send('Product created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/stock_levels/:product_id', async (req, res) => {
  const productId = req.params.product_id;
  const { quantity_in_stock, reorder_level, last_updated } = req.body;

  const query = 'UPDATE stock_levels SET quantity_in_stock = ?, reorder_level = ?, last_updated = ? WHERE product_id = ?';
  try {
    await client.execute(query, [quantity_in_stock, reorder_level, last_updated, productId], { prepare: true });
    res.send('Stock level updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = app;
