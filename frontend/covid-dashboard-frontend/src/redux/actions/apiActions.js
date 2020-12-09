import axios from 'axios';

// should probably set this as an env var
const apiUrl = 'https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod';

export function fetchStateData() {
    return axios({
        method: 'get',
        url: `${apiUrl}/states/`
    });
}

export function fetchSingleStateData(stateId) {
    return axios({
        method: 'get',
        url: `${apiUrl}/states/${stateId}/`
    })
}