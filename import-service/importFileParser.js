'use strict';

const AWS = require('aws-sdk');
const csv = require('csv-parser');

const s3 = new AWS.S3({
  region: 'us-east-1',
});
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: 'us-east-1'
});

module.exports.fileParser = async (event) => {
  console.log('my event', JSON.stringify(event));
  const key = decodeURIComponent(event.Records[0].s3.object.key);

  const params = {
    Bucket: process.env.UPLOADED_BUCKET,
    Key: key
  }

  const s3Stream = s3.getObject(params).createReadStream();

  await new Promise((resolve, reject) => {
    s3Stream.pipe(csv({
        headers: ["title", "description", "price", "count"]
      }))
      .on("data", async (data) => {
        console.log(data);
        const result = await sendMessageToSQS(data);
        console.log('message sent', result)
      })
      .on("end", async () => {
        console.log("file parsed")
        await s3.copyObject({
          Bucket: process.env.UPLOADED_BUCKET,
          CopySource: `shaduryna-5-task/${key}`,
          Key: key.replace("uploaded", "parsed"),
        }).promise();

        await s3.deleteObject({
          Bucket: process.env.UPLOADED_BUCKET,
          Key: key
        }).promise();

        resolve();
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      });
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "FileParser"
    }, null, 2)
  }
};


async function sendMessageToSQS(product) {
  console.log('sendMessageToSQS process.env', process.env)

  return sqs
    .sendMessage({
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(product),
    })
    .promise();
}