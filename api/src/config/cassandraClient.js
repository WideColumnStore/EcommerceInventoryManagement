const cassandra = require('cassandra-driver');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { bucketName, bundleKey, astraAPIToken } = require('./config');

const s3 = new AWS.S3();
const localSecureBundlePath = path.join(__dirname, 'bundle.zip');
let client;

async function downloadSecureBundle() {
    const params = {
        Bucket: bucketName,
        Key: bundleKey
    };

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(localSecureBundlePath);
        s3.getObject(params)
            .createReadStream()
            .pipe(file)
            .on('close', () => resolve(localSecureBundlePath))
            .on('error', reject);
    });
}

async function createClient() {
    try {
      const secureBundlePath = await downloadSecureBundle();

      const cloud = { secureConnectBundle: secureBundlePath };
      const authProvider = new cassandra.auth.PlainTextAuthProvider('token', astraAPIToken);
      client = new cassandra.Client({ cloud, authProvider, keyspace: 'inventory_keyspace' });
      return client;

    } catch (error) {
      console.error('Error downloading secure bundle or connecting to Cassandra:', error);
    }
}

module.exports = {
  createClient,
};