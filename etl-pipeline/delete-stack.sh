#!/bin/bash

set -x

aws cloudformation delete-stack --stack-name airflow-ubuntu \
  --profile serverless-admin \
  --region us-east-2
