import axios from 'axios';

export function fetchStateData() {
    return axios({
        method: 'get',
        url: 'https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod/states/'
    });
}