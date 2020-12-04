#!/bin/bash

set -x

aws cloudformation describe-stacks --stack-name airflow-ubuntu \
  --profile serverless-admin \
  --region us-east-2
