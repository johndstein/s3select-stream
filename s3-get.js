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
  const readStream = pumpify(
    s3.getObject({
      Bucket: bucket,
      Key: sourceKey
    }).createReadStream(),
    zlib.createGunzip(),
    split(),
    new Parse(),
    new Stringify(),
  )
  .on('error', (error) => { console.error(error) })


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