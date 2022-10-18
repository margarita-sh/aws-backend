'use strict';

const AWS = require('aws-sdk');

const {
  PRODUCTS_TABLE,
  STOCKS_TABLE
} = require('./shared/utils');

AWS.config.update({
  region: 'us-east-1'
});

const ddb = new AWS.DynamoDB.DocumentClient;


async function getProduct(id) {
  const result = await ddb
    .get({
      TableName: PRODUCTS_TABLE,
      Key: {
        id
      },
    })
    .promise();

  return result.Item;
}

async function getStockByProductId(product_id) {
  const result = await ddb
    .get({
      TableName: STOCKS_TABLE,
      Key: {
        product_id
      },
    })
    .promise();

  return result.Item;
}

module.exports.getProductsById = async (event) => {
  try {
    console.log('arguments for /products{productId} GET', event);

    const productId = event.pathParameters['productId'];

    const product = await getProduct(productId);
    const stock = await getStockByProductId(productId);

    if (product && stock) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...product,
          count: stock.count
        }),
      };
    } else {
      return {
        body: JSON.stringify("Product is not found"),
        statusCode: 404
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Opps! Something went wrong :(" + e.message
      }),
    };
  }
};