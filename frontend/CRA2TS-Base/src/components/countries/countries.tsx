import React, { useState } from 'react';
import styles from './countries.module.css';
import Button from 'react-bootstrap/Button';
import { XHR } from '../../services/xhr/XHR';
import ICountries from '../../components/countries/ICountries';

const xhr = XHR.getInstance();

const getCountries = () => xhr.DoGetCountries();

const CountriesGrid = () => {

    const [countries, setCountries] = useState(xhr.Countries);

    const getCountriesControl = () => {
        getCountries().then(() => {
            setCountries(xhr.Countries);
        });
    }
    
    return (
        <div>
            <Button onClick={getCountriesControl}>Get Countries</Button>
            <div className="container-fluid">
                <div className={`row ${styles['countries-grid-row']}`}>
                    <div>{
                        countries.map((country: any, i: number) => {
                            return (
                                <div>
                                    <p>{country.country}</p>
                                    <p>{country.location_id}</p>
                                </div>
                            );
                        })
                    }</div>
                </div>
            </div>
        </div>
    );
};

export default CountriesGrid;