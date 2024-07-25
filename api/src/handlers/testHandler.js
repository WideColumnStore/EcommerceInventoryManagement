const { createClient } = require('../config/cassandraClient');

const getProducts = async (req, res) => {
  let client;

  try {
    client = await createClient();

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

module.exports = {
  getProducts,
};
