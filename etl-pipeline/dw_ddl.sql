
CREATE TABLE IF NOT EXISTS date_dim (
  date_id INTEGER PRIMARY KEY,
  date DATE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  day_of_month INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS location_dim (
  location_id INTEGER PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255),
  city VARCHAR(255),
  latitude NUMERIC(12, 9),
  longitude NUMERIC(12, 9),
  population INTEGER
);

CREATE OR REPLACE PROCEDURE create_covid_facts_tables()
LANGUAGE plpgsql
AS $$
BEGIN

  CREATE TABLE IF NOT EXISTS covid_facts (
    date_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    cases INTEGER,
    recoveries INTEGER,
    deaths INTEGER,
    cases_100k NUMERIC(12, 6),
    testing_rate NUMERIC(12, 6),
    hospitalization_rate NUMERIC(12, 6),
    PRIMARY KEY (date_id, location_id)
  );

  CREATE TABLE IF NOT EXISTS tmp_covid_facts (
    LIKE covid_facts 
    INCLUDING ALL
  );

END; $$;


CREATE OR REPLACE PROCEDURE refresh_from_tmp_facts()
LANGUAGE plpgsql
AS $$
BEGIN

  DROP TABLE covid_facts;

  CALL create_covid_facts_tables();

  INSERT INTO covid_facts
  SELECT * FROM tmp_covid_facts;

END; $$;

CREATE OR REPLACE PROCEDURE upsert_covid_fact(
    p_date_id INTEGER,
    p_location_id INTEGER,
    p_cases INTEGER,
    p_recoveries INTEGER,
    p_deaths INTEGER,
    p_cases_100k DECIMAL,
    p_testing_rate DECIMAL,
    p_hospitalization_rate DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN

  INSERT INTO tmp_covid_facts as tbl (
    date_id,
    location_id,
    cases,
    recoveries,
    deaths,
    cases_100k,
    testing_rate,
    hospitalization_rate
  ) VALUES (
    p_date_id,
    p_location_id,
    p_cases,
    p_recoveries,
    p_deaths,
    p_cases_100k,
    p_testing_rate,
    p_hospitalization_rate
  )
  ON CONFLICT (date_id, location_id)
  DO UPDATE
    SET 
      cases = CASE WHEN tbl.cases IS NULL THEN p_cases ELSE tbl.cases END,
      recoveries = CASE WHEN tbl.recoveries IS NULL THEN p_recoveries ELSE tbl.recoveries END,
      deaths = CASE WHEN tbl.deaths IS NULL THEN p_deaths ELSE tbl.deaths END,
      cases_100k = CASE WHEN tbl.cases_100k IS NULL THEN p_cases ELSE tbl.cases_100k END,
      testing_rate = CASE WHEN tbl.testing_rate IS NULL THEN p_testing_rate ELSE tbl.testing_rate END,
      hospitalization_rate = CASE WHEN tbl.hospitalization_rate IS NULL THEN p_hospitalization_rate ELSE tbl.hospitalization_rate END;

END; $$;

CALL create_covid_facts_tables();

