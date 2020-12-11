import axios from 'axios';

// should probably set this as an env var
const apiUrl = process.env.REACT_APP_API_URL;

export function fetchCountryData() {
    return axios({
        method: 'get',
        url: `${apiUrl}/countries/`
    });
}

export function fetchCountryDetailData(countryId) {
    return axios({
        method: 'get',
        url: `${apiUrl}/countries/${countryId}/`
    })
}

export function fetchStateData() {
    return axios({
        method: 'get',
        url: `${apiUrl}/states/`
    });
}

export function fetchStateDetailData(stateId) {
    return axios({
        method: 'get',
        url: `${apiUrl}/states/${stateId}/`
    })
}

export function fetchCityData() {
    return axios({
        method: 'get',
        url: `${apiUrl}/cities/`
    });
}

export function fetchCityDetailData(cityId) {
    return axios({
        method: 'get',
        url: `${apiUrl}/cities/${cityId}/`
    })
}