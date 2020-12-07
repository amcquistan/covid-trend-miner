
import os
import shutil
import sys

from collections import namedtuple
from datetime import datetime, date
from sqlalchemy import create_engine

import pandas as pd
import numpy as np


HeaderMapping = namedtuple('HeaderMapping', ['raw_name', 'output_name'])

LOCATION_ID_HEADER = 'location_id'
DATE_ID_HEADER = 'date_id'

CITY_HEADER = 'city'
STATE_HEADER = 'state'
COUNTRY_HEADER = 'country'
COMBINED_HEADER = 'combined_key'
FIPS_HEADER = 'FIPS'
UID_HEADER = 'UID'

LATITUDE_HEADER = 'latitude'
LONGITUDE_HEADER = 'longitude'

CASES_HEADER = 'cases'
DEATHS_HEADER = 'deaths'
RECOVERIES_HEADER = 'recoveries'

# Tests performed per 100,000 people
TESTING_RATE_HEADER = 'testing_rate'

# hospitalized / number cases
HOSPITALIZATION_RATE_HEADER = 'hospitalization_rate'

# Cases per 100,000 people
CASES_100K_HEADER = 'cases_100k'

DATE_HEADER = 'date'
POPULATION_HEADER = 'population'

state_v1 = HeaderMapping('Province/State', STATE_HEADER)
state_v2 = HeaderMapping('Province_State', STATE_HEADER)

country_v1 = HeaderMapping('Country/Region', COUNTRY_HEADER)
country_v2 = HeaderMapping('Country_Region', COUNTRY_HEADER)

cases_v1 = HeaderMapping('Confirmed', CASES_HEADER)

deaths_v1 = HeaderMapping('Deaths', DEATHS_HEADER)


recoveries_v1 = HeaderMapping('Recovered', RECOVERIES_HEADER)

testing_rate_v1 = HeaderMapping('Testing_Rate', TESTING_RATE_HEADER)

hospitalization_rate_v1 = HeaderMapping('Hospitalization_Rate', HOSPITALIZATION_RATE_HEADER)

cases_100K_v1 = HeaderMapping('Incidence_Rate', CASES_100K_HEADER)
cases_100K_v2 = HeaderMapping('Incident_Rate', CASES_100K_HEADER)

latitude_v1 = HeaderMapping('Latitude', LATITUDE_HEADER)
latitude_v2 = HeaderMapping('Lat', LATITUDE_HEADER)

longitude_v1 = HeaderMapping('Longitude', LONGITUDE_HEADER)
longitude_v2 = HeaderMapping('Long_', LONGITUDE_HEADER)


known_headers = [
    'Province/State,Country/Region,Last Update,Confirmed,Deaths,Recovered',
    'Province/State,Country/Region,Last Update,Confirmed,Deaths,Recovered,Latitude,Longitude',
    'FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key',
    'FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key,Incidence_Rate,Case-Fatality_Ratio',
    'FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key,Incident_Rate,Case_Fatality_Ratio',
    'Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,FIPS,Incident_Rate,People_Tested,People_Hospitalized,Mortality_Rate,UID,ISO3,Testing_Rate,Hospitalization_Rate',
    'Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,FIPS,Incident_Rate,Total_Test_Results,People_Hospitalized,Case_Fatality_Ratio,UID,ISO3,Testing_Rate,Hospitalization_Rate'
]

header_transformation_mappings = [
    state_v1,
    state_v2,

    country_v1,
    country_v2,

    cases_v1 ,
    deaths_v1,

    recoveries_v1,

    testing_rate_v1,

    hospitalization_rate_v1,

    cases_100K_v1,
    cases_100K_v2,

    latitude_v1,
    latitude_v2,

    longitude_v1,
    longitude_v2,
]

required_headers = [
    CITY_HEADER,
    STATE_HEADER,
    COUNTRY_HEADER,

    LATITUDE_HEADER,
    LONGITUDE_HEADER,

    CASES_HEADER,
    DEATHS_HEADER,
    RECOVERIES_HEADER,

    TESTING_RATE_HEADER,

    HOSPITALIZATION_RATE_HEADER,

    CASES_100K_HEADER,
]

load_headers = [
    DATE_ID_HEADER,
    LOCATION_ID_HEADER,
    
    CASES_HEADER,
    RECOVERIES_HEADER,
    DEATHS_HEADER,
    
    CASES_100K_HEADER,

    TESTING_RATE_HEADER,

    HOSPITALIZATION_RATE_HEADER,
]

def remap_header_name(header_name):
    '''Given any string, match it to an instance of HeaderMapping
    and return the output_name of the match or the original
    header_name if no match it found.

    Args:
      header_name (str): raw input header name to transform
    
    Returns:
      A header name that underwent transformation
    '''
    for hm in header_transformation_mappings:
        if header_name == hm.raw_name:
            return hm.output_name
    return header_name


def transform_headers(df, ds):
    '''Takes a Pandas DataFrame, validates the headers are from an
    an expected list of headers the ETL pipeline knows apriori and 
    remaps the names of the headers to a uniform set of names and order

    Args:
      df (DataFrame): input DataFrame to transform
      ds (str or datetime): the date stamp the DataFrame contains data for

    Returns:
      A transformed DataFrame with uniform header names and order
    '''
    if isinstance(ds, str):
        ds = datetime.strptime(ds, '%m-%d-%Y')
    elif not isinstance(ds, datetime):
        raise TypeError('ds argument is expected to be either a datetime instance or str representing one')

    transformed_df = df.rename(columns=remap_header_name)
    
    keep_columns = [col for col in transformed_df.columns
                    if col in required_headers]

    add_columns = [col for col in required_headers
                  if col not in keep_columns]

    transformed_df = transformed_df[keep_columns]

    for col in add_columns:
        transformed_df[col] = np.nan

    transformed_df[DATE_HEADER] = ds

    expected_order = [DATE_HEADER] + required_headers
    transformed_df = transformed_df[expected_order]

    if 'Combined_Key' not in df.columns:
        combined_key_rows = []
        for idx, row in transformed_df.iterrows():
            combined = ''
            if not pd.isnull(row.city) and row.city:
                combined += row.city + ', '
            
            if not pd.isnull(row.state) and row.state and row.state != row.country:
                combined += row.state + ', '
            
            if not pd.isnull(row.country) and row.country:
                combined += row.country

            combined_key_rows.append(combined)
    
        transformed_df[COMBINED_HEADER] = combined_key_rows
    else:
        transformed_df[COMBINED_HEADER] = df.Combined_Key
    
    transformed_df[COMBINED_HEADER] = transformed_df[COMBINED_HEADER].str.lower()

    if 'FIPS' not in df.columns:
        transformed_df[FIPS_HEADER] = np.nan
    else:
        transformed_df[FIPS_HEADER] = df.FIPS

    if 'UID' not in df.columns:
        transformed_df[UID_HEADER] = np.nan
    else:
        transformed_df[UID_HEADER] = df.UID

    return transformed_df


COVID_DATA_START_DATE = date(2020, 1, 22)

def make_date_dims(start, end=None):
    date_range = pd.date_range(start=start,
                               end=end or date.today(),
                               freq='1D')

    data = {
        'date_id': list(range(1, len(date_range)+1)),
        'date': date_range.date,
        'year': date_range.year,
        'month': date_range.month,
        'day_of_month': date_range.day,
        'day_of_week': date_range.weekday
    }

    return pd.DataFrame(data, index=date_range)


def parse_city_from_combined_key(key):
    parts = key.split(',')
    if len(parts) == 3:
        return parts[0]
    return None


def transform_global():
    INPUT_DATA_DIR = os.path.join(os.path.abspath('../../../'),
                            'COVID-19',
                            'csse_covid_19_data',
                            'csse_covid_19_daily_reports')
    print("Input Dir: " + INPUT_DATA_DIR)

    TRANSFORMED_DATA_DIR = os.path.join(os.path.abspath('../../../'), 'COVID-19-TRANSFORMED')

    if os.path.exists(TRANSFORMED_DATA_DIR):
        shutil.rmtree(TRANSFORMED_DATA_DIR)

    os.makedirs(TRANSFORMED_DATA_DIR)

    print("Output Dir: " + TRANSFORMED_DATA_DIR)

    # Fix any BOM files (there are some early on ones in Jan 2020, could be more later)

    input_files = [f for f in os.listdir(INPUT_DATA_DIR) if f.endswith('.csv')]

    for f in input_files:
        input_f = os.path.join(INPUT_DATA_DIR, f)
        output_f = os.path.join(TRANSFORMED_DATA_DIR, 'global_'+f)
        with open(input_f, mode='r', encoding='utf-8-sig') as fin, open(output_f, mode='w', encoding='utf-8') as fout:
            fout.write(fin.read())


    # remap headers to consistent format
    files = [f for f in os.listdir(TRANSFORMED_DATA_DIR) if f.startswith('global_')]

    for f in files:
        fname, fext = os.path.splitext(f)
        date_str = fname.replace('global_', '')
        file_path = os.path.join(TRANSFORMED_DATA_DIR, f)
        with open(file_path) as fp:
            headers = fp.readline().strip()
            if headers not in known_headers:
                print("{} has unrecognized headers {}".format(f, headers))
                sys.exit(1)

            print('Transforming {}'.format(f))
            df = pd.read_csv(file_path)
            transformed_df = transform_headers(df, date_str)
        transformed_path = os.path.join(TRANSFORMED_DATA_DIR, 'transformed_'+date_str+'.csv')
        transformed_df.to_csv(transformed_path)


def transform_us():
    INPUT_DATA_DIR = os.path.join(os.path.abspath('../../../'),
                            'COVID-19',
                            'csse_covid_19_data',
                            'csse_covid_19_daily_reports_us')
    print("Input Dir: " + INPUT_DATA_DIR)

    TRANSFORMED_DATA_DIR = os.path.join(os.path.abspath('../../../'), 'COVID-19-TRANSFORMED')

    if not os.path.exists(TRANSFORMED_DATA_DIR):
        os.makedirs(TRANSFORMED_DATA_DIR)

    print("Output Dir: " + TRANSFORMED_DATA_DIR)


    # Fix any BOM files (there are some early on ones in Jan 2020, could be more later)
    input_files = [f for f in os.listdir(INPUT_DATA_DIR) if f.endswith('.csv')]

    for f in input_files:
        input_f = os.path.join(INPUT_DATA_DIR, f)
        output_f = os.path.join(TRANSFORMED_DATA_DIR, 'us_'+f)
        with open(input_f, mode='r', encoding='utf-8-sig') as fin, open(output_f, mode='w', encoding='utf-8') as fout:
            fout.write(fin.read())


    # remap headers to consistent format
    files = [f for f in os.listdir(TRANSFORMED_DATA_DIR) if f.startswith('us_')]
    for f in files:
        fname, fext = os.path.splitext(f)
        date_str = fname.replace('us_', '')
        file_path = os.path.join(TRANSFORMED_DATA_DIR, f)
        with open(file_path) as fp:
            headers = fp.readline().strip()
            df = pd.read_csv(file_path)
            if headers not in known_headers:
                print("{} has unrecognized headers {}".format(f, headers))
                df.head()
                sys.exit(1)

            print('Transforming {}'.format(f))
            
            transformed_df = transform_headers(df, date_str)
        transformed_path = os.path.join(TRANSFORMED_DATA_DIR, 'transformed_'+date_str+'.csv')

        if os.path.exists(transformed_path):
            global_df = pd.read_csv(transformed_path)
            for country in transformed_df.country.unique():
                global_df = global_df.loc[global_df.country != country]
            transformed_df = pd.concat([transformed_df, global_df])

        transformed_df.to_csv(transformed_path)


COVID_TMP_FACTS_TBL = 'tmp_covid_facts'
COVID_DATE_DIM_TBL = 'date_dim'
COVID_LOCATION_DIM_TBL = 'location_dim'


def create_sql_engine():
    return create_engine('postgresql://etl:etl@localhost:5432/etl')


def validate_location_sql_entry(row):
    values = (
        row.location_id,
        row.country,
        row.state if pd.notnull(row.state) else None,
        row.city if pd.notnull(row.city) else None,
        row.latitude,
        row.longitude,
        int(row.population) if pd.notnull(row.population) else None
    )
    return values


def validate_covid_facts_sql_entry(row):
    values = (
        int(row.date_id),
        int(row.location_id),
        int(row.cases) if pd.notnull(row.cases) else None,
        int(row.recoveries) if pd.notnull(row.recoveries) else None,
        int(row.deaths) if pd.notnull(row.deaths) else None,
        row.cases_100k if pd.notnull(row.cases_100k) else None,
        row.testing_rate if pd.notnull(row.testing_rate) else None,
        row.hospitalization_rate if pd.notnull(row.hospitalization_rate) else None
    )
    return values


def regenerate_tmp_covid_facts_table():
    conn = None
    try:
        engine = create_sql_engine()
        conn = engine.raw_connection()
        cur = conn.cursor()
        cur.execute('DROP TABLE tmp_covid_facts')
        cur.execute('CALL create_covid_facts_tables()')
        cur.close()

    except Exception as e:
        print('Failed to regenerate tmp_covid_facts table', e)
    finally:
        if conn:
            conn.close()


def load_covid_facts_from_tmp():
    conn = None
    try:
        engine = create_sql_engine()
        conn = engine.raw_connection()
        cur = conn.cursor()
        cur.execute('CALL refresh_from_tmp_facts()')
        cur.close()
    except Exception as e:
        print('Failed to load covid_facts from tmp_covid_facts table', e)
    finally:
        if conn:
            conn.close()


def load():
    LOCATIONS_PATH = os.path.join(os.path.abspath('../../../'),
                            'COVID-19',
                            'csse_covid_19_data',
                            'UID_ISO_FIPS_LookUp_Table.csv')
    print("Locations File: " + LOCATIONS_PATH)

    TRANSFORMED_DATA_DIR = os.path.join(os.path.abspath('../../../'), 'COVID-19-TRANSFORMED')

    print("Output Dir: " + TRANSFORMED_DATA_DIR)

    locations_df = pd.read_csv(LOCATIONS_PATH)
    lower_combined_key = locations_df.Combined_Key.str.lower().values
    locations_df = locations_df.set_index(lower_combined_key)

    locations_df['city'] = locations_df.Combined_Key.apply(parse_city_from_combined_key)

    locations_dim_df = locations_df.rename(columns={
        'UID': LOCATION_ID_HEADER,
        'Province_State': STATE_HEADER,
        'Country_Region': COUNTRY_HEADER,
        'Lat': LATITUDE_HEADER,
        'Long_': LONGITUDE_HEADER,
        'Population': POPULATION_HEADER
    })

    keep_columns = [
        LOCATION_ID_HEADER,
        COUNTRY_HEADER,
        STATE_HEADER,
        CITY_HEADER,
        LATITUDE_HEADER,
        LONGITUDE_HEADER,
        POPULATION_HEADER
    ]
    locations_dim_df = locations_dim_df[keep_columns]
    locations_dim_df.to_csv(os.path.join(TRANSFORMED_DATA_DIR, 'loadable_locations.csv'),
                            index=False)
    
    locations_sql = '\n'.join([
        'INSERT INTO location_dim ({})'.format(','.join(keep_columns)),
        'VALUES (%s, %s, %s, %s, %s, %s, %s)',
        'ON CONFLICT (location_id) DO NOTHING'
    ])

    conn = None
    try:
        engine = create_sql_engine()
        conn = engine.raw_connection()
        cur = conn.cursor()
        for idx, row in locations_dim_df.iterrows():
            cur.execute(locations_sql, validate_location_sql_entry(row))
        conn.commit()
        cur.close()
    except Exception as e:
        print('Failed to insert locations', e)
    finally:
        if conn:
            conn.close()

    date_df = make_date_dims(COVID_DATA_START_DATE)
    date_df.to_csv(os.path.join(TRANSFORMED_DATA_DIR, 'loadable_dates.csv'),
                   index=False)

    date_sql = '\n'.join([
        'INSERT INTO date_dim (date_id, date, year, month, day_of_month, day_of_week)',
        'VALUES (%s, %s, %s, %s, %s, %s)',
        'ON CONFLICT (date_id) DO NOTHING'
    ])

    date_values = [row.values.tolist() for idx, row in date_df.iterrows()]

    conn = None
    try:
        engine = create_sql_engine()
        conn = engine.raw_connection()
        cur = conn.cursor()
        cur.executemany(date_sql, date_values)
        conn.commit()
        cur.close()
    except Exception as e:
        print('Failed to insert dates', e)
    finally:
        if conn:
            conn.close()

    files = [f for f in os.listdir(TRANSFORMED_DATA_DIR) 
            if f.startswith('transformed_')]

    regenerate_tmp_covid_facts_table()

    for f in files:
        file_path = os.path.join(TRANSFORMED_DATA_DIR, f)
        df = pd.read_csv(file_path)

        # date date_id column of df based off date column values
        df[DATE_ID_HEADER] = [date_df.loc[ds, 'date_id']
                             for ds in df[DATE_HEADER]]

        df[LOCATION_ID_HEADER] = df[UID_HEADER].values

        for idx, row in df.loc[pd.isnull(df[UID_HEADER])].iterrows():
            if pd.notnull(row[FIPS_HEADER]) and int(row[FIPS_HEADER]) in locations_df.FIPS.values:
                loc_row = locations_df.loc[locations_df.FIPS == int(row[FIPS_HEADER])]
                df.loc[idx, LOCATION_ID_HEADER] = int(loc_row.UID)
            elif str(row[COMBINED_HEADER]) in locations_df.index.values:
                loc_row = locations_df.loc[row[COMBINED_HEADER]]
                df.loc[idx, LOCATION_ID_HEADER] = int(loc_row.UID)
            
        df2 = df[load_headers].loc[pd.notnull(df[LOCATION_ID_HEADER])]
        if not df2.shape[0]:
            print('File {} will have not data'.format(f))
            print(df2.head())
            sys.exit(1)
        else:
            loadable_path = os.path.join(TRANSFORMED_DATA_DIR,
                                        f.replace('transformed_', 'loadable_'))
            df2.to_csv(loadable_path, index=False)
            conn = None
            try:
                engine = create_sql_engine()
                conn = engine.raw_connection()
                cur = conn.cursor()
                sql = 'CALL upsert_covid_fact(%s,%s,%s,%s,%s,%s,%s,%s)'
                for idx, row in df2.iterrows():
                    cur.execute(sql, validate_covid_facts_sql_entry(row))
                conn.commit()
                cur.close()
            except Exception as e:
                print('Failed to upsert covid facts', e)
            finally:
                if conn:
                    conn.close()

    load_covid_facts_from_tmp()


if __name__ == '__main__':
    # transform_global()
    # transform_us()
    load()

