const AWS = require('aws-sdk');
const { awsRegion, awsAccessKeyId, awsSecretAccessKey } = require('./config');

AWS.config.update({
  region: awsRegion,
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
});

module.exports = AWS;