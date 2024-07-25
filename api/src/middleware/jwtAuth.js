const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const verifyToken = (req, res, next) => {
  const client = jwksClient({
    jwksUri: `https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_jMKdGw89H/.well-known/jwks.json`
  });

  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decodedToken = jwt.decode(token, { complete: true });
  const kid = decodedToken.header.kid;

  client.getSigningKey(kid, (err, key) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const signingKey = key.getPublicKey();

    jwt.verify(token, signingKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  });
};

module.exports = verifyToken;