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
            <Button variant="outline-primary" onClick={getCountriesControl}>Get Countries</Button>
            <div className="container-fluid">
                {
                    countries.map((country: any, i: number) => {
                        return (
                            <div className={`row`}>
                                <label className={`col-6`}>{country.country}</label><label className={`col-6`}>Location id: {country.location_id}</label>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default CountriesGrid;