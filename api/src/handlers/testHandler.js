const { initializeClient } = require('../config/cassandraClient');

const getProducts = async (req, res) => {
  const client = await initializeClient();

  try {
    const query = 'SELECT * FROM test_keyspace.test_table';

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

module.exports = {
  getProducts,
};
