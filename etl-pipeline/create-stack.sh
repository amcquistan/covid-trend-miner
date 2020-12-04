#!/bin/bash

set -x

aws cloudformation create-stack --stack-name airflow-ubuntu \
  --template-body file://cf-template.yaml \
  --parameters ParameterKey=KeyPairName,ParameterValue=personal-us-east-2 \
  --region us-east-2 \
  --profile serverless-admin
