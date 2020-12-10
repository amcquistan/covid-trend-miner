#!/bin/bash

# exit when any command fails
set -eE -o functrace

REACT_BKT_NAME=covid-dashboard-cicd
AWS_REGION=us-east-2

set -x

aws s3 rm s3://$REACT_BKT_NAME/ --recursive

aws s3 cp ./build s3://$REACT_BKT_NAME/ --recursive

BKT_URL="http://$REACT_BKT_NAME.s3-website.$AWS_REGION.amazonaws.com"

printf "\n\nDeployed to: $BKT_URL\n\n"
