import json
import os
from flask import request, jsonify
from flask_lambda import FlaskLambda

import psycopg2
from psycopg2 import extras


app = FlaskLambda(__name__)


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


@app.route('/countries/')
def fetch_countries():
    sql = """
        SELECT DISTINCT location_id, country 
        FROM location_dim 
        WHERE state IS NULL
            AND city IS NULL ORDER BY country;
        """
    db = connect_to_db()
    cursor = db.cursor(cursor_factory=extras.DictCursor)
    cursor.execute(sql)
    countries = [dict(row) for row in cursor.fetchall()]
    return jsonify(countries)


def to_float(data, key):
    val = data.get(key, None)
    if val:
        return float(val)
    return None


def normalize_datatypes(data):
    dc = dict(data)
    dc['cases_100k'] = to_float(dc, 'cases_100k')
    dc['testing_rate'] = to_float(dc, 'testing_rate')
    dc['hospitalization_rate'] = to_float(dc, 'hospitalization_rate')
    dc['latitude'] = to_float(dc, 'latitude')
    dc['longitude'] = to_float(dc, 'longitude')

    return dc


@app.route('/countries/<int:country_id>/')
def fetch_country(country_id):
    sql = """
        SELECT DISTINCT f.date_id, f.location_id, cases, recoveries, deaths, cases_100k, testing_rate, hospitalization_rate,
        date, year, month, day_of_week, day_of_month,
        country, state, city, latitude, longitude, population
        FROM covid_facts f JOIN date_dim d ON d.date_id = f.date_id
        JOIN location_dim l ON l.location_id = f.location_id
        WHERE f.location_id = %s
        """

    db = connect_to_db()
    cursor = db.cursor(cursor_factory=extras.DictCursor)
    cursor.execute(sql, (country_id, ))
    days = [normalize_datatypes(row) for row in cursor.fetchall()]
    return jsonify(days)


@app.route('/states/')
def fetch_states():
    sql = """
        SELECT DISTINCT location_id, state FROM location_dim WHERE city IS NULL ORDER BY state;
        """
    db = connect_to_db()
    cursor = db.cursor(cursor_factory=extras.DictCursor)
    cursor.execute(sql)
    states = [dict(row) for row in cursor.fetchall()]
    return jsonify(states)


@app.route('/states/<int:state_id>/')
def fetch_state(state_id):
    sql = """
        SELECT DISTINCT f.date_id, f.location_id, cases, recoveries, deaths, cases_100k, testing_rate, hospitalization_rate,
        date, year, month, day_of_week, day_of_month,
        country, state, city, latitude, longitude, population
        FROM covid_facts f JOIN date_dim d ON d.date_id = f.date_id
        JOIN location_dim l ON l.location_id = f.location_id
        WHERE f.location_id = %s;
        """
    db = connect_to_db()
    cursor = db.cursor(cursor_factory=extras.DictCursor)
    cursor.execute(sql, (state_id, ))
    days = [normalize_datatypes(row) for row in cursor.fetchall()]
    return jsonify(days)


@app.route('/cities/')
def fetch_cities():
    sql = """
        SELECT DISTINCT location_id, city FROM location_dim ORDER BY city;
        """
    db = connect_to_db()
    cursor = db.cursor(cursor_factory=extras.DictCursor)
    cursor.execute(sql)
    cities = [dict(row) for row in cursor.fetchall()]
    return jsonify(cities)


@app.route('/cities/<int:city_id>/')
def fetch_city(city_id):
    sql = """
        SELECT DISTINCT f.date_id, f.location_id, cases, recoveries, deaths, cases_100k, testing_rate, hospitalization_rate,
        date, year, month, day_of_week, day_of_month,
        country, state, city, latitude, longitude, population
        FROM covid_facts f JOIN date_dim d ON d.date_id = f.date_id
        JOIN location_dim l ON l.location_id = f.location_id
        WHERE f.location_id = %s;
        """
    db = connect_to_db()
    cursor = db.cursor(cursor_factory=extras.DictCursor)
    cursor.execute(sql, (city_id, ))
    days = [normalize_datatypes(row) for row in cursor.fetchall()]
    return jsonify(days)
