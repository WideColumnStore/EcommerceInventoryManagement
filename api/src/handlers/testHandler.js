const cassandra = require('cassandra-driver');
const { keyspaceUsername, keyspacePassword, bucketName, certKey } = require('../config/config');
const AWS = require('../config/awsConfig');

const s3 = new AWS.S3();

const auth = new cassandra.auth.PlainTextAuthProvider(keyspaceUsername, keyspacePassword);

const getCertificate = async () => {
  try {
    const params = {
      Bucket: bucketName,
      Key: certKey,
    };

    const data = await s3.getObject(params).promise();
    return data.Body.toString('utf-8');
  } catch (error) {
    console.error(`Error fetching certificate from S3: ${error}`);
    throw error;
  }
};

const initializeClient = async () => {
  try {
    const certificate = await getCertificate();

    const sslOptions1 = {
      ca: [certificate],
      host: 'cassandra.eu-west-1.amazonaws.com',
      rejectUnauthorized: true,
    };

    return new cassandra.Client({
      contactPoints: ['cassandra.eu-west-1.amazonaws.com'],
      localDataCenter: 'eu-west-1',
      authProvider: auth,
      sslOptions: sslOptions1,
      protocolOptions: { port: 9142 },
    });
  } catch (error) {
    console.error(`Error initializing Cassandra client: ${error}`);
    throw error;
  }
};

const getProducts = async (req, res) => {
  try {
    const client = await initializeClient();
    const query = 'SELECT * FROM test_keyspace.test_table';

    client.execute(query)
      .then(result => res.status(200).json(result.rows))
      .catch(e => console.log(`${e}`));
  } catch (error) {
    console.error(`Error in getProducts: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getProducts,
};
