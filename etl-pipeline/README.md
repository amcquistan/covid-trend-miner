# Apache Airflow ETL Pipeline

This directory will contain the Airflow DAGs and associated code for ETL along with the scripts needed to provision a Air Flow installation on a Linux EC2 instance

### Airflow Installation on Ubuntu

Update server and install build essentials

```
sudo apt-get update
sudo apt-get install build-essential python3-pip -y
```

Pull down Airflow Python Requirements File

```
wget https://raw.githubusercontent.com/apache/airflow/v1-10-stable/requirements/requirements-python3.6.txt
```

Install with pip

```
pip3 install "apache-airflow[postgres,amazon,celery,crypto,rabbitmq,redis]"==1.10.10 \
  --constraint requirements-python3.6.txt
```

Install Additional Linux Deps

```
sudo apt-get install -y --no-install-recommends \
        freetds-bin \
        krb5-user \
        ldap-utils \
        libffi6 \
        libsasl2-2 \
        libsasl2-modules \
        libssl1.1 \
        locales  \
        lsb-release \
        sasl2-bin \
        sqlite3 \
        unixodbc
```

Update local path for linux user

```
echo "PATH=$PATH:~/.local/bin" >> ~/.profile
source ~/.profile
```


Initialize airflow with stock defaults

```
airflow initdb
mkdir airflow/dags
```

Flip config param for load_examples in airflow/airflow.cfg to false and regenerate db



__Install Nginx__

```
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

Add nginx config to /etc/nginx/sites-available/nginx.conf

```
server_names_hash_bucket_size 128;

server {
  listen 80;
  server_name ec2-18-219-42-103.us-east-2.compute.amazonaws.com;

  location /airflow/ {
      proxy_pass http://localhost:8080;
      proxy_set_header Host $host;
      proxy_redirect off;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
  }
}
```

Link config to sites-enabled directory.

```
ln -s /etc/nginx/sites-available/airflow.conf /etc/nginx/sites-enabled/airflow.conf
```

Install Postgresql

```
sudo su -
echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" > /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
apt-get update
apt install postgresql-11 -y
systemctl status postgresql
systemctl enable postgresql
```


