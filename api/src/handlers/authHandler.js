const { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } = require('amazon-cognito-identity-js');
const { cognitoId, cognitoClientId } = require('../config/config');

const getToken = async (req, res) => {
  const poolData = {
    UserPoolId: cognitoId,
    ClientId: cognitoClientId,
  };
  
  const userPool = new CognitoUserPool(poolData);

  const { username, password } = req.body;

  const authenticationData = {
    Username: username,
    Password: password
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      const accessToken = result.getAccessToken().getJwtToken();
      res.status(200).json({token: accessToken});
    },
    onFailure: (err) => {
      console.log(err);
      res.status(403).send("Not authorized");
    }
  });
}

const signUp = async (req, res) => {
    const poolData = {
      UserPoolId: cognitoId,
      ClientId: cognitoClientId,
    };
    
    const userPool = new CognitoUserPool(poolData);
  
    const { username, password, email } = req.body;
    const attributeList = [];

    const dataEmail = {
      Name: 'email',
      Value: email
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send("Error signing up");
      } else {
        res.status(200).send("User created");
      }
    });
};

module.exports = {
  getToken,
  signUp,
};
