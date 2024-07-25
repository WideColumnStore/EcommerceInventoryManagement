const { initializeClient } = require('../config/cassandraClient');

const getProductSales = async (req, res) => {
  const client = await initializeClient();
    const query = 'SELECT product_name, transaction_date, SUM(total_cost) as total_cost, COUNT(*) as quantity FROM transactions_by_date GROUP BY transaction_date, product_name';

    await client.execute(query)
      .then(result => res.status(200).json(result.rows))
      .catch(error => {
        console.error(`Error in getProducts: ${error}`);
        res.status(500).send('Internal Server Error');
      })
      .finally(async () => {
        await client.shutdown();
      });
};

module.exports = {
  getProductSales,
};
