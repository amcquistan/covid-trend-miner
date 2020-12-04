from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator

from time import sleep
from datetime import datetime

def print_hello():
    sleep(10)
    print('hello world')
    return 'hello world'


with DAG('hello_world_dag', description='Demo Hello World DAG', schedule_interval='*/10 * * * *', start_date=datetime(2020, 10, 1), catchup=False) as dag:
    dummy_task = DummyOperator(task_id='dummy_task', retries=3)
    python_task = PythonOperator(task_id='python_task', python_callable=print_hello)

    dummy_task >> python_task
