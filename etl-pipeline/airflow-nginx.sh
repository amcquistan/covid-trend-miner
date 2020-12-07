#!/bin/bash

# exit when any command fails and echo out each command
set -ex

USER=$(whoami)

if [[ $USER != "etl" ]]; then
  printf "\n\n!!!Exiting this is meant to be ran by etl user\n"
  exit 1
fi

cd /home/etl/covid-trend-miner/etl-pipeline

sudo cp airflow-nginx.conf /etc/nginx/sites-available/airflow-nginx.conf
sudo ln -s /etc/nginx/sites-available/airflow-nginx.conf /etc/nginx/sites-enabled/airflow-nginx.conf

sudo unlink /etc/nginx/sites-enabled/default

# need to update base_url = http://ec2-3-128-133-211.us-east-2.compute.amazonaws.com/airflow in /home/etl/airflow/airflow.cfg
