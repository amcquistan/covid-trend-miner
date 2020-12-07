#!/bin/bash

# exit when any command fails and echo out each command
set -ex

if [[ -f ./.env ]]; then
  source .env
else
  printf "\n\n Warning: expecting .env file containing environment variables. Will search environment next.\n"
fi

if [[ -z $COVID_AWS_CF_STACKNAME ]]; then
  printf "\n\n!!! Exiting due to missing required environment variable COVID_AWS_CF_STACKNAME\n"
  exit 1
fi

if [[ -z $COVID_AWS_PROFILE ]]; then
  printf "\n\n!!! Exiting due to missing required environment variable COVID_AWS_PROFILE\n"
  exit 1
fi

if [[ -z $COVID_AWS_REGION ]]; then
  printf "\n\n!!! Exiting due to missing required environment variable COVID_AWS_REGION\n"
  exit 1
fi


aws cloudformation delete-stack --stack-name $COVID_AWS_CF_STACKNAME \
  --profile $COVID_AWS_PROFILE \
  --region $COVID_AWS_REGION
