#!/bin/bash

# exit when any command fails and echo out each command
set -ex

USER=$(whoami)

if [[ $USER != "etl" ]]; then
  printf "\n\n!!!Exiting this is meant to be ran by etl user\n"
  exit 1
fi

cd /home/etl/covid-trend-miner/etl-pipeline

cp airflow-pid.conf /etc/tmpfiles.d/airflow-pid.conf

cp airflow-systemd.conf /etc/airflow-systemd.conf

cp airflow-webserver.service /etc/systemd/system/airflow-webserver.service
cp airflow-scheduler.service /etc/systemd/system/airflow-scheduler.service







