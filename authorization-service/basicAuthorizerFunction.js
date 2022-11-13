'use strict';

module.exports.basicAuthorizer = async (event) => {

  try {
    console.log('----EVENT----', JSON.stringify(event));
    const {
      headers
    } = event;
    if (!headers.authorization) {
      return {
        isAuthorized: false
      }
    }
    const authorizationToken = headers.authorization;

    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const userName = plainCreds[0];
    const password = plainCreds[1];
    console.log(`userName: ${userName}, password: ${password}`);
    const storedUserPassword = process.env[userName];

    if (password && storedUserPassword === password) {
      return {
        isAuthorized: true
      };
    } else {
      return {
        isAuthorized: false,
        context: {
          "username": userName,
        }
      }
    }

  } catch (e) {
    throw new Error(e.message);
  }
};