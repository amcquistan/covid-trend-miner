import React, { useState }  from 'react';
import styles from './countries.module.css';
import Button from 'react-bootstrap/Button';
import { XHR } from '../../services/xhr/XHR';
import ICountries from '../../components/countries/ICountries';

const xhr = XHR.getInstance();

const getCountriesButton = () => xhr.DoGetCountries();

getCountriesButton();

const CountriesGrid = () => {

    const [countries, setCountries] = useState(xhr.Countries);

    const getCountries = (countries: ICountries[]) => {
        console.log(`Fetching countries...`);
        setCountries(countries);
    }

    xhr.callback = getCountries;

    return (
        <div>
            <div className="container-fluid">
                <div className={`row ${styles['countries-grid-row']}`}>
                    <Button onClick={getCountriesButton}>Get Countries</Button>
                    {countries}
                </div>
            </div>
        </div>
    );
};

export default CountriesGrid;