'use strict'

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const bucket = process.env.s3s_bucket
const sourceKey = process.env.s3s_source_key
const destKey = process.env.s3s_dest_key
const zlib = require('zlib')
const {
  S3SelectStream,
  Parse,
  Stringify,
  Ssplit,
} = require('./streams')
const pumpify = require('pumpify')
// const split = () => new Ssplit()
// const split = require('split')
// const split = require('split2')
const split = require('binary-split')

const main = async () => {
  const readStream = await s3.selectObjectContent({
    Expression: 'SELECT * FROM s3object',
    ExpressionType: 'SQL',
    InputSerialization: { JSON: { Type: 'LINES' }, CompressionType: 'GZIP' },
    OutputSerialization: { JSON: {} },
    Bucket: bucket,
    Key: sourceKey,
  })
    .promise()
    // .then((data) => data.Payload.pipe(new S3SelectStream()))
    // .then((data) => pumpify.obj(data.Payload, new S3SelectStream()))
    // .then((data) => pumpify(data.Payload, new S3SelectStream(), split()))
    .then((data) => pumpify(data.Payload, new S3SelectStream(), split(), new Parse(), new Stringify()))
  const params = {
    Bucket: bucket,
    Key: destKey,
    Body: readStream,
  }
  await s3.upload(params).promise()
  console.log('upload complete')
}

main()
  .then(() => [
    console.log('success')
  ])
  .catch((error) => {
    console.error(error)
    process.exit(13)
  })