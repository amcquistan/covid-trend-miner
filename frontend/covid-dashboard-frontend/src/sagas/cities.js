import { call, takeLatest, put } from 'redux-saga/effects';
import { fetchCityData,  fetchCityDetailData} from '../redux/actions/apiActions';
import * as types from '../redux/actions/types'

export function* watchFetchCities() {
  yield call(fetchCities)
  yield takeLatest(types.FETCH_CITIES, fetchCities);
}

export function* fetchCities() {
  try {
    const response = yield call(fetchCityData);
    const responseData = response.data;

    yield put({ type: types.FETCH_CITIES_SUCCESS, responseData })
  } catch(e) {
    console.log(e)
    yield put({ type: types.FETCH_CITIES_FAIL, e })
  }
}

export function* watchFetchCityDetail() {
  yield takeLatest(types.FETCH_CITY, fetchCityDetail);
}

export function* fetchCityDetail(action) {
  try {
    const response = yield call(fetchCityDetailData, action.arg);
    const responseData = response.data;

    yield put({ type: types.FETCH_CITY_SUCCESS, responseData })
  } catch(e) {
    console.log(e)
    yield put({ type: types.FETCH_CITY_FAIL, e })
  }
}
