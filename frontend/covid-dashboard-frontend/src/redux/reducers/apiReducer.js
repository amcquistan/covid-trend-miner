
import {
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAIL,
  FETCH_COUNTRY_SUCCESS,
  FETCH_COUNTRY_FAIL,
  FETCH_STATES_SUCCESS,
  FETCH_STATES_FAIL,
  FETCH_STATE_SUCCESS,
  FETCH_STATE_FAIL,
  FETCH_CITIES_SUCCESS,
  FETCH_CITIES_FAIL,
  FETCH_CITY_SUCCESS,
  FETCH_CITY_FAIL,
} from '../actions/types'

function initState() {
  return {
    countries: [],
    countryDetail: [],
    states: [],
    stateDetail: [],
    cities: [],
    cityDetail: [],
    fetchCountriesErrorMessage: '',
    fetchCountryErrorMessage: '',
    fetchStatesErrorMessage: '',
    fetchStateErrorMessage: '',
    fetchCitiesErrorMessage: '',
    fetchCityErrorMessage: '',
  };
}

function updateState(key, value, oldState = null) {
  const newState = oldState ? { ...oldState } : initState();
  newState[key] = value;
  return newState;
}

const initialState = initState()

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  console.log('apiReducer action', action)

  switch(action.type) {
    // Country
    case FETCH_COUNTRIES_SUCCESS:
      return updateState('countries', action.payload)
    case FETCH_COUNTRIES_FAIL:
      return updateState('fetchCountriesErrorMessage', action.error.message)
    case FETCH_COUNTRY_SUCCESS:
      return updateState('countryDetail', action.payload)
    case FETCH_COUNTRY_FAIL:
      return updateState('fetchCountryErrorMessage', action.error.message)
    // State
    case FETCH_STATES_SUCCESS:
      return updateState('states', action.payload)
    case FETCH_STATES_FAIL:
      return updateState('fetchStatesErrorMessage', action.error.message)
    case FETCH_STATE_SUCCESS:
      return updateState('stateDetail', action.payload)
    case FETCH_STATE_FAIL:
      return updateState('fetchStateErrorMessage', action.error.message)
    // City
    case FETCH_CITIES_SUCCESS:
      return updateState('cities', action.payload)
    case FETCH_CITIES_FAIL:
      return updateState('fetchCitiesErrorMessage', action.error.message)
    case FETCH_CITY_SUCCESS:
      return updateState('city', action.payload)
    case FETCH_CITY_FAIL:
      return updateState('fetchCityErrorMessage', action.error.message)
    default:
      return state;
  }
}