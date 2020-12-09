import { all, call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_COUNTRIES, FETCH_COUNTRIES_SUCCESS } from '../redux/actions';
import { COUNTRIES_URL } from '../env';

export function* fetchCountriesList() {
    console.log(`endpoint url:  ${COUNTRIES_URL}`);
    const endpoint = COUNTRIES_URL;
    const response = yield call(fetch, endpoint);
    const data = yield response.json();
    yield put({ type: FETCH_COUNTRIES_SUCCESS, data: data });
}

export function* loadCountriesList() {
    yield takeEvery(FETCH_COUNTRIES, fetchCountriesList);
}

export default function* rootSaga() {
    yield all([loadCountriesList()]);
}