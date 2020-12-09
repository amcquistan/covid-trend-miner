export const getCountriesState = store => store.countriesReducer;

export const getCountriesList = store => getCountriesState(store) ? getCountriesState(store).countries : [];

export const getCountries = store => getCountriesList(store).map(country => country);
