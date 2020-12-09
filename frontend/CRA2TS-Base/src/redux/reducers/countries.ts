//  This reducer is combined with all the other in the root index.ts reducer file.
import { FETCH_COUNTRIES_SUCCESS } from '../actions/index';

const initialState = {
    countries: []
};

//  Left unamed so that it can be given an explicit name in the root reducer
export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_COUNTRIES_SUCCESS:
            //  action.payload is defined in the root saga at present.
            const newState = { ...state, countries: action.payload };
            return newState;
        default:
            return state;
    }
}
