//  THE SINGLE SOURCE OF TRUTH
//  ==========================
//
//  Create store takes the rootReducer which is all of the reducers combined together
//  and binds them to the store.  the saga middle ware binds the sagas to the store
//  when actions are dispatched the corresponding binding will decide what happens.
//
//  For example  in the countries reducer the action FETCH_COUNTRIES_SUCCESS will update the 
//  state for the countries portion of the store whenever a component or object dispatches the FETCH_COUNTRIES_SUCCESS
//  action.  FETCH_COUNTRIES_SUCCESS is defined in the root index.ts action file.
import rootReducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;