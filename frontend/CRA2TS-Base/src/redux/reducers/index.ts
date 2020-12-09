import { GET_COUNTRIES } from '../actions/index';
import { RENDER_COUNTRIES_LIST } from '../actions/index';

const initialState: any = () => {
    return {
        countries: []
    };
};

export default function COVIDMiner(state = initialState, action: any) {
    switch (action.type) {
        case GET_COUNTRIES:
            console.log('Hello GET_COUNTRIES');
            return {
                state
            };
        case RENDER_COUNTRIES_LIST:
            console.log('Hello RENDER_COUNTRIES_LIST');
            return {
                state
            };
        default:
            return state;
    }
}