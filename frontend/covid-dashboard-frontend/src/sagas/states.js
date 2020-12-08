import { call, takeLatest, put } from 'redux-saga/effects';
import { fetchStateData } from '../redux/actions/apiActions';
import * as types from '../redux/actions/types'

export function* watchFetchStates() {
  console.log('in watcher')
  yield call(fetchStates)
  yield takeLatest(types.FETCH_STATES, fetchStates);
}

export function* fetchStates() {
  try {
      const response = yield call(fetchStateData);
      const responseData = response.data;

      yield put({ type: types.FETCH_STATES_SUCCESS, responseData })
  } catch(e) {
      console.log(e)
      yield put({ type: types.FETCH_STATE_FAIL, e })
  }
}

