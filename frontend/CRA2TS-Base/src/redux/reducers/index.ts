import { combineReducers } from "redux";
import countriesReducer from './countries';


const rootReducer = combineReducers({
    countriesReducer,
});

export default rootReducer;