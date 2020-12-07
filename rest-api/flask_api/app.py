import json
import os
from flask import request, jsonify
from flask_lambda import FlaskLambda

import psycopg2
from psycopg2 import extras


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
    cursor = db.cursor(cursor_factory=extras.DictCursor)
    cursor.execute(sql)
    countries = [dict(row) for row in cursor.fetchall()]
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
