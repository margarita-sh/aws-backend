'use strict';
const data = require('./assets/data.json')


module.exports.getProductsList = async (event) => {
  try {
    const response = data.map((d) => ({
      ...d,
      img: `http://images-shaduryna.s3.amazonaws.com/${d.img}`
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(
        response
      )
    }
  } catch (e) {
    console.log('error', e)
  }
};