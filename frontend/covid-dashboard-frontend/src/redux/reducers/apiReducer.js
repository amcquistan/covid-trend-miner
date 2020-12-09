
import {
  FETCH_COUNTRIES,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAIL,
  FETCH_COUNTRY,
  FETCH_COUNTRY_SUCCESS,
  FETCH_COUNTRY_FAIL,
  FETCH_STATES,
  FETCH_STATES_SUCCESS,
  FETCH_STATES_FAIL,
  FETCH_STATE,
  FETCH_STATE_SUCCESS,
  FETCH_STATE_FAIL,
  FETCH_CITIES,
  FETCH_CITIES_SUCCESS,
  FETCH_CITIES_FAIL,
  FETCH_CITY,
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
    loading: false,
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
    case FETCH_COUNTRIES:
      return updateState('loading', true)
    case FETCH_COUNTRIES_SUCCESS:
      return updateState('countries', action.responseData, state)
    case FETCH_COUNTRIES_FAIL:
      return updateState('fetchCountriesErrorMessage', action.error.message, state)
    case FETCH_COUNTRY:
      return updateState('loading', true, state)
    case FETCH_COUNTRY_SUCCESS:
      return updateState('countryDetail', action.responseData, state)
    case FETCH_COUNTRY_FAIL:
      return updateState('fetchCountryErrorMessage', action.error.message, state)
    // State
    case FETCH_STATES:
      return updateState('loading', true)
    case FETCH_STATES_SUCCESS:
      return updateState('states', action.responseData, state)
    case FETCH_STATES_FAIL:
      return updateState('fetchStatesErrorMessage', action.error.message, state)
    case FETCH_STATE:
      return updateState('loading', true, state)
    case FETCH_STATE_SUCCESS:
      return updateState('stateDetail', action.responseData, state)
    case FETCH_STATE_FAIL:
      return updateState('fetchStateErrorMessage', action.error.message, state)
    // City
    case FETCH_CITIES:
      return updateState('loading', true, state)
    case FETCH_CITIES_SUCCESS:
      return updateState('cities', action.responseData, state)
    case FETCH_CITIES_FAIL:
      return updateState('fetchCitiesErrorMessage', action.error.message, state)
    case FETCH_CITY:
      return updateState('loading', true, state)
    case FETCH_CITY_SUCCESS:
      console.log('fetch city success reducer')
      return updateState('cityDetail', action.responseData, state)
    case FETCH_CITY_FAIL:
      return updateState('fetchCityErrorMessage', action.error.message, state)
    default:
      return state;
  }
}