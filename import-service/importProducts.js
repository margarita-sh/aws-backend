'use strict';

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const s3Client = new S3Client({ region: 'us-east-1' });

function createSignedUrl(name){
  const fileName = `uploaded/${name.replace(/\.csv$/, "")}.${Date.now()}.csv`;

  const bucketParams = {
    Bucket: process.env.UPLOADED_BUCKET,
    Key: fileName,
    ContentType: "text/csv",
  }

  const command = new PutObjectCommand(bucketParams);

  return getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });
}

module.exports.importProductsFile = async (event) => {
  try {
    console.log('event', event);
    const name = event.queryStringParameters.name;

    if (!name || name.length === 0) {
      throw createError(400, JSON.stringify({
        message: "name is required"
      }));
    }

    const signedUrl = await createSignedUrl(name)

    return {
      statusCode: 200,
      body: JSON.stringify({url: signedUrl})
    };
  } catch (err) {
    console.log(`error: ${err}`);
  }
};
