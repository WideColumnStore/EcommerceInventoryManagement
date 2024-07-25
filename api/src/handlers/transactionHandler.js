const { initializeClient } = require('../config/cassandraClient');

const getProductSales = async (req, res) => {
  const client = await initializeClient();

  try {
    const query = 'SELECT product_name, COUNT(*) FROM test_keyspace.transactions_by_date WHERE transaction_date = ? GROUP BY product_name';

    client.execute(query, [req.params.transaction_date], {prepare: true})
      .then(result => res.status(200).json(result.rows))
      .catch(error => {
        console.error(`Error in getProducts: ${error}`);
        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
  } finally {
    await client.shutdown();
  }
};

module.exports = {
  getProductSales,
};
