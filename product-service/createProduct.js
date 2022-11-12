'use strict';

const AWS = require('aws-sdk');
const {
    prepareAndInsertItem
} = require('./shared/utils.js');

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
        const inserted = await prepareAndInsertItem(ddb, body)
        if (inserted) {
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