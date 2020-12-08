import { createStore, applyMiddleware, compose } from "redux";
// import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';

export default function configureStore(sagaMiddleware, initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
                              || compose; // add support for Redux dev tools
  return createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  );
}