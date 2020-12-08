import { call } from 'redux-saga/effects';
import { fetchStateData } from '../redux/actions/apiActions';

export function* covidDataAll() {
    try {
        const response = yield call(fetchStateData);
        const responseData = response.data;
    } catch(e) {
        console.log(e)
    }
}