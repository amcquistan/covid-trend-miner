import { all, call, put, takeEvery } from 'redux-saga/effects';
import { LOAD_COUNTRIES_LIST, RENDER_COUNTRIES_LIST } from '../redux/actions/index';
import { COUNTRIES_URL } from '../env';

export function* fetchCountriesList() {
    const endpoint = COUNTRIES_URL;
    const response = yield call(fetch, endpoint);
    const data = yield response.json();
    yield put({ type: RENDER_COUNTRIES_LIST, countries: data });
}

export function* loadCountriesList() {
    yield takeEvery(LOAD_COUNTRIES_LIST, fetchCountriesList);
}

export default function* rootSaga() {
    yield all([loadCountriesList()]);
}