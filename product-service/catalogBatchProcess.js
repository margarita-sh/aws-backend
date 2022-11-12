'use strict';

const AWS = require('aws-sdk');
const {
    prepareAndInsertItem
} = require('./shared/utils');

AWS.config.update({
    region: 'us-east-1'
});
const ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

const sns = new AWS.SNS({
    region: 'us-east-1'
});

module.exports.catalogBatchProcess = async (event) => {
    try {
        const products = event.Records.map(({
            body
        }) => body)

        for (const productJson of products) {
            const product = JSON.parse(productJson)
            try {
                const inserted = await prepareAndInsertItem(ddb, product)
                console.log('inserted', inserted);
                const params = {
                    TopicArn: process.env.SNS_ARN,
                    Subject: "Test SNS From Lambda",
                    Message: `Created products: ${JSON.stringify(product)}`,
                };

                const publishMessagePromise = await sns.publish(params).promise();

                publishMessagePromise.then(
                    (data) => {
                        console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                        console.log("MessageID is " + data.MessageId);
                    }
                ).catch(
                    function (err) {
                        console.log('SNS error', err);
                    });
            } catch (e) {
                console.log('ERROR catalogBatchProcess', e);
            }
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