import {  }  from './countries'
import { watchFetchStates } from './states'
import {  } from './cities'
import { all } from 'redux-saga/effects'

const allSagas = [
    watchFetchStates,
]

export function* appSagas() {
    yield all(allSagas.map(sagas => sagas()))
}
