export const GET_COUNTRIES = 'GET_COUNTRIES';
export const LOAD_COUNTRIES_LIST = 'LOAD_COUNTRIES_LIST';
export const RENDER_COUNTRIES_LIST = 'RENDER_COUNTRIES_LIST';

export function loadCountriesList() {
    return {
        type: LOAD_COUNTRIES_LIST
    };
}