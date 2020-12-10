import { call, takeLatest, put } from 'redux-saga/effects';
import { fetchStateData,  fetchStateDetailData} from '../redux/actions/apiActions';
import * as types from '../redux/actions/types'

export function* watchFetchStates() {
  // yield call(fetchStates)
  yield takeLatest(types.FETCH_STATES, fetchStates);
}

export function* fetchStates() {
  try {
    const response = yield call(fetchStateData);
    const responseData = response.data;

    yield put({ type: types.FETCH_STATES_SUCCESS, responseData })
  } catch(e) {
    console.log(e)
    yield put({ type: types.FETCH_STATES_FAIL, e })
  }
}

export function* watchFetchStateDetail() {
  yield takeLatest(types.FETCH_STATE, fetchStateDetail);
}

export function* fetchStateDetail(action) {
  try {
    const response = yield call(fetchStateDetailData, action.arg);
    const responseData = response.data;

    yield put({ type: types.FETCH_STATE_SUCCESS, responseData })
  } catch(e) {
    console.log(e)
    yield put({ type: types.FETCH_STATE_FAIL, e })
  }
}
