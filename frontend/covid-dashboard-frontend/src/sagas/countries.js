import { call, takeLatest, put } from 'redux-saga/effects';
import { fetchCountryData,  fetchCountryDetailData} from '../redux/actions/apiActions';
import * as types from '../redux/actions/types'

export function* watchFetchCountries() {
  yield takeLatest(types.FETCH_COUNTRIES, fetchCountries);
}

export function* fetchCountries() {
  try {
    const response = yield call(fetchCountryData);
    const responseData = response.data;

    yield put({ type: types.FETCH_COUNTRIES_SUCCESS, responseData })
  } catch(e) {
    console.log(e)
    yield put({ type: types.FETCH_COUNTRIES_FAIL, e })
  }
}

export function* watchFetchCountryDetail() {
  yield takeLatest(types.FETCH_COUNTRY, fetchCountryDetail);
}

export function* fetchCountryDetail(action) {
  try {
    const response = yield call(fetchCountryDetailData, action.arg);
    const responseData = response.data;

    yield put({ type: types.FETCH_COUNTRY_SUCCESS, responseData })
  } catch(e) {
    console.log(e)
    yield put({ type: types.FETCH_COUNTRY_FAIL, e })
  }
}