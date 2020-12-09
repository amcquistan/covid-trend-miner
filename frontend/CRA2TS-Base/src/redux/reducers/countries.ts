import { FETCH_COUNTRIES_SUCCESS } from '../actions/index';

const initialState = {
    countries: []
};

export const getCountries = (state) => state.countries;

export default function(state = initialState, action: any) {
    switch (action.type) {
        case FETCH_COUNTRIES_SUCCESS:
            console.log('Action FETCH_COUNTRIES_SUCCESS');
            const newState = { ...state };
            newState.countries = action.data;
            state = newState;
            return state;
        default:
            return state;
    }
}
