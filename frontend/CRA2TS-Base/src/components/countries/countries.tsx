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
        <div className={styles['countries-grid']}>
            <Button className={styles['button']} variant='outline-primary' onClick={getCountriesControl}>Get Countries</Button>
            <table className='table table-striped table-responsive'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Country</th>
                        <th>Country ID</th>
                    </tr>
                </thead>
                {
                    countries.map((country: any, i: number) => {
                        return (
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{country.country}</td>
                                <td>{country.location_id}
                                </td>
                            </tr>
                        );
                    })
                }
            </table>
        </div>
    );
};

export default CountriesGrid;