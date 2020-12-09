import { FETCH_COUNTRIES_SUCCESS } from '../actions/index';

export interface ICountry {
    country: string;
    location_id: string;
}

export interface ICountryAction {
    type: string;
    payload?: ICountry[];
}

const initialState = {
    countries: []
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_COUNTRIES_SUCCESS:
            const newState = { ...state, countries: action.payload };
            return newState;
        default:
            return state;
    }
}
