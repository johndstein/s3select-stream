# S3 Select Stream

```sh
export s3s_bucket='my_bucket'
export s3s_source_key='my_source_key'
export s3s_dest_key='my_dest_key'

node s3-get.js \
  && aws s3 ls $s3s_bucket/$s3s_dest_key

node s3-select.js \
  && aws s3 ls $s3s_bucket/$s3s_dest_key

aws s3 cp s3://$s3s_bucket/$s3s_source_key - | gunzip
```
