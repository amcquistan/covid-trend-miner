//  TODO:   Organize into separate saga files
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_COUNTRIES, FETCH_COUNTRIES_SUCCESS } from '../redux/actions';
import { COUNTRIES_URL } from '../env';

//  Magic.  This generator function will basically build a funciton
//  that will make the fetch request and dispatch FETCH_COUNTRIES_SUCCESS on success.
export function* fetchCountriesList() {
    const endpoint = COUNTRIES_URL;
    const response = yield call(fetch, endpoint);
    const data = yield response.json();
    yield put({ type: FETCH_COUNTRIES_SUCCESS, payload: data });
}

//  Creates a function that will call the above generated function from fetchCountriesList when the FETCH_COUNTRIES action
//  is dispatched.  
//  For example to trigger a request to update the country list you can
//  dispatch({ type: FETCH_COUNTRIES }); 
export function* loadCountriesList() {
    yield takeEvery(FETCH_COUNTRIES, fetchCountriesList);
}

//  Add the above generated function to the list of sagas in the root saga
export default function* rootSaga() {
    yield all([loadCountriesList()]);
}