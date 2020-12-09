import { watchFetchCountries, watchFetchCountryDetail }  from './countries'
import { watchFetchStates, watchFetchStateDetail } from './states'
import { watchFetchCities, watchFetchCityDetail } from './cities'
import { all } from 'redux-saga/effects'

const allSagas = [
    watchFetchCountries,
    watchFetchCountryDetail,
    watchFetchStates,
    watchFetchStateDetail,
    watchFetchCities,
    watchFetchCityDetail
]

export function* appSagas() {
    yield all(allSagas.map(sagas => sagas()))
}
