import json
import os
from flask import request, jsonify
from flask_lambda import FlaskLambda

import psycopg2
from psycopg2 import sql


def connect_to_db():
    # create db connection

    from urllib.parse import urlparse
    result = urlparse(os.environ['DB_URL'])

    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname

    db = psycopg2.connect(
        dbname=database,
        user=username,
        password=password,
        host=hostname,)

    # Open a cursor to perform database operations
    print('Connected to db')
    return db

app = FlaskLambda(__name__)

@app.route('/countries/')
def fetch_countries():
    sql = """
        SELECT DISTINCT location_id, country FROM location_dim WHERE state IS NULL
        AND city IS NULL ORDER BY country;
        """
    db = connect_to_db()
    cursor = db.cursor()
    cursor.execute(sql)
    rows = cursor.fetchall()

    countries = []
    for row in rows:
        location_id, country = row
        countries.append({'country': str(country), 'location_id': int(location_id)})
    return jsonify(countries)


# @app.route('/countries/<int:country_id>')
# def fetch_country(country_id):
#     sql = """
#         SELECT DISTINCT f.date_id, f.location_id, cases, recoveries, deaths, cases_100k, testing_rate, hospitalization_rate,
#         date, year, month, day_of_week, day_of_month,
#         country, state, city, latitude, longitude, population
#         FROM covid_facts f JOIN date_dim d ON d.date_id = f.date_id
#         JOIN location_dim l ON l.location_id = f.location_id
#         WHERE f.location_id = %s;
#         """


# @app.route('/states')
# def fetch_states():
#     sql = """
#         SELECT DISTINCT location_id, state FROM location_dim WHERE city IS NULL ORDER BY state;
#         """


# @app.route('/states/<int:state_id>')
# def fetch_state(state_id):
#     sql = """
#         SELECT DISTINCT f.date_id, f.location_id, cases, recoveries, deaths, cases_100k, testing_rate, hospitalization_rate,
#         date, year, month, day_of_week, day_of_month,
#         country, state, city, latitude, longitude, population
#         FROM covid_facts f JOIN date_dim d ON d.date_id = f.date_id
#         JOIN location_dim l ON l.location_id = f.location_id
#         WHERE f.location_id = %s;
#         """

# @app.route('/cities')
# def fetch_cities():
#     sql = """
#         SELECT DISTINCT location_id, city FROM location_dim ORDER BY state;
#         """

# @app.route('/cities/<int:city_id>')
# def fetch_city(city_id):
#     sql = """
#         """


def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """

    # try:
    #     ip = requests.get("http://checkip.amazonaws.com/")
    # except requests.RequestException as e:
    #     # Send some context about this error to Lambda Logs
    #     print(e)

    #     raise e

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world",
            # "location": ip.text.replace("\n", "")
        }),
    }
