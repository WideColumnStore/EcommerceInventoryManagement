const cassandra = require('cassandra-driver');
const { keyspaceUsername, keyspacePassword, bucketName, certKey } = require('./config');
const AWS = require('./awsConfig');

const s3 = new AWS.S3();

const auth = new cassandra.auth.PlainTextAuthProvider(keyspaceUsername, keyspacePassword);

let client;

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
  const certificate = await getCertificate();
  const sslOptions1 = {
    ca: [certificate],
    host: 'cassandra.eu-west-1.amazonaws.com',
    rejectUnauthorized: true,
  };

  client = new cassandra.Client({
    contactPoints: ['cassandra.eu-west-1.amazonaws.com'],
    localDataCenter: 'eu-west-1',
    authProvider: auth,
    sslOptions: sslOptions1,
    protocolOptions: { port: 9142 },
  });

  return client;
};

module.exports = {
  initializeClient,
};