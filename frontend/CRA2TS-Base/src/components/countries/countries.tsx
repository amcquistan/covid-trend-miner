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

//  When the state gets updated in the store this will pull out the countries array,
//  The getCountries function is a mapping function. Not sure why redux wants it this way.
const mapStateToProps = state => {
    const countries = getCountries(state);
    return { countries };
};

//  Call mapStateToProps for this component (CountriesGrid)
export default connect(mapStateToProps)(CountriesGrid);