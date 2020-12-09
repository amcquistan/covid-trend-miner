import React from 'react';
import { useDispatch, connect } from 'react-redux';
import styles from './countries.module.css';
import Button from 'react-bootstrap/Button';
import { FETCH_COUNTRIES } from '../../redux/actions';
import { getCountries } from '../../redux/selectors/countries';


const CountriesGrid = ({ countries = [] }: any) => {
    
    const dispatch = useDispatch();

    const getCountriesControl = () => {
        dispatch({ type: FETCH_COUNTRIES });
    }

    return (
        <div className={styles['countries-grid']}>
            <Button className={styles['button']} variant='outline-primary' onClick={getCountriesControl}>Get Countries</Button>
            <table className='table table-hover table-responsive'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Country</th>
                        <th>Country ID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        countries.map((country: any, i: number) => {
                            if (countries.length < 1) return;
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{country.country}</td>
                                    <td>{country.location_id}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

const mapStateToProps = state => {
    const countries = getCountries(state);
    return { countries };
};

export default connect(mapStateToProps)(CountriesGrid);