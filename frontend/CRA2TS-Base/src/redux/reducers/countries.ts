import { FETCH_COUNTRIES_SUCCESS } from '../actions/index';

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
