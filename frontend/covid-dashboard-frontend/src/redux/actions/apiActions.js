import axios from 'axios';

// should probably set this as an env var
const apiUrl = 'https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod';

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