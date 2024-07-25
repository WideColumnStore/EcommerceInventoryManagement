require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  keyspaceUsername: process.env.KEYSPACE_USERNAME,
  keyspacePassword: process.env.KEYSPACE_PASSWORD,
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.BUCKET_NAME,
  certKey: process.env.CERT_KEY,
  astraAPIToken: process.env.ASTRA_API_TOKEN,
  bundleKey: process.env.BUNDLE_KEY
};
