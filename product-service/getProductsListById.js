'use strict';
const data = require('./assets/data.json')

module.exports.getProductsById = async (event) => {
  try {
    const productId = event.pathParameters['productId'];
    const product = data.find((item) => item.id.toString() === productId);
    if (product) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(product),
      };
    } else {
      throwError('Error')
    }
  } catch (e) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Opps! Product not found verify if id exists."
      }),
    };
  }
};