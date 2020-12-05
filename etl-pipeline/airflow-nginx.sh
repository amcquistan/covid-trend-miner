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
