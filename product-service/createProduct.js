'use strict';
const {
    v4: uuidv4
} = require('uuid');
const AWS = require('aws-sdk');
const {
    createProductObject,
    createStocksObject,
    createInsertObject,
    insertItems
} = require('./shared/utils.js')

AWS.config.update({
    region: 'us-east-1'
});
const ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

module.exports.createProduct = async (event) => {
    try {
        console.log('arguments for /products POST', event);
        const body = JSON.parse(event.body);

        const id = uuidv4();
        const product = createProductObject(id, body.description, '1.jpg', body.price, body.title)
        const stock = createStocksObject(id, body.count);
        const preperedObject = createInsertObject(product, stock);
        await insertItems(ddb, preperedObject);

        if (product && stock) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    result: 'ok'
                })
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: e.message
                }),
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