
from airflow import DAG

from airflow.operators.bash_operator import BashOperator
from airflow.operators.python_operator import PythonOperator

from datetime import datetime

import covid_etl as etl

default_args = {
  'owner': 'etl',
  'start_date': datetime(2020, 1, 22)
}


with DAG('covid_dag',
         default_args=default_args,
         description='ETL pipeline consuming data from Johns Hopkins Data Repo',
         schedule_interval='0 */6 * * *',
         catchup=False) as dag:
    
    git_pull_task = BashOperator(task_id='covid_git_pull',
                                 bash_command='cd /home/etl/COVID-19 && git pull')
    
    transform_global_task = PythonOperator(task_id='transform_global_task',
                                           python_callable=etl.transform_global)
    
    transform_us_task = PythonOperator(task_id='transform_us_task',
                                       python_callable=etl.transform_us)
    
    load_task = PythonOperator(task_id='load_task',
                               python_callable=etl.load)

    git_pull_task >> transform_global_task >> transform_us_task >> load
