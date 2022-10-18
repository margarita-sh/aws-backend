'use strict';

const AWS = require('aws-sdk');
const {
  PRODUCTS_TABLE,
  STOCKS_TABLE
} = require('./shared/utils');

AWS.config.update({
  region: 'us-east-1'
});
const ddb = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
});


async function listItems() {
  const products = (await ddb.scan({
    TableName: PRODUCTS_TABLE
  }).promise()).Items
  const stocks = (await ddb.scan({
    TableName: STOCKS_TABLE
  }).promise()).Items

  return products.map(item => ({
    id: item.id.S,
    title: item.title.S,
    description: item.description.S,
    count: Number(stocks.find(stock => stock.product_id.S === item.id.S).count.N),
    img: `http://images-shaduryna.s3.amazonaws.com/${item.img.S}`,
    price: Number(item.price.N)
  }))
}


module.exports.getProductsList = async (event) => {
  try {
    console.log('arguments for /products GET', event);

    const data = await listItems();

    return {
      statusCode: 200,
      body: JSON.stringify(
        data
      )
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