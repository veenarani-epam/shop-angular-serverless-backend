'use strict';
const dotenv = require('dotenv');

module.exports.basicAuthorizer = async (event) => {
  if (event.type !== 'TOKEN') {
    console.log('Unauthorized');
  }
  try {
    dotenv.config();
    const token = event.authorizationToken;
    const methodArn = event.methodArn;
    const principalId = 'testLog';
    const effect = isValidToken(token) ? 'Allow' : 'Deny';

    const authResponse = {
      "principalId": principalId, "policyDocument": {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
          }
        ]
      }
    }
    return authResponse;
  }
  catch (error) {
    console.log(`Unauthorized: ${error}`)
  }

};

function isValidToken(token) {
  let isValid = false;

  if (token && token !== null) {
    const [, value] = token.split(' ');
    if (value !== 'null' && value !== ' ') {
      const decoded = Buffer.from(value, 'base64').toString('utf8');
      const [user, pass] = decoded.split(':');
      isValid = process.env[user] === pass ? true : false;
    }
  }

  return isValid;
}