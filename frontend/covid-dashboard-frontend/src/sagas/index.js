import {  }  from './countries'
import { watchFetchStates, watchFetchStateDetail } from './states'
import {  } from './cities'
import { all } from 'redux-saga/effects'

const allSagas = [
    watchFetchStates,
    watchFetchStateDetail
]

export function* appSagas() {
    yield all(allSagas.map(sagas => sagas()))
}
