//  Get the reducer for countries
//  TODO:   Should this check to see if the async is complete?
export const getCountriesState = store => store.countriesReducer;

//  If the reducet exists return the array
export const getCountriesList = store => getCountriesState(store) ? getCountriesState(store).countries : [];

//  Map the array.  Not sure why this is needed.  But it wouldn't work with out it.
export const getCountries = store => getCountriesList(store).map(country => country);
