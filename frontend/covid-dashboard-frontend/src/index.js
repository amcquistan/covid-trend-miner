import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'jquery/dist/jquery.min.js';
import "font-awesome/css/font-awesome.css";
import "tempusdominus-bootstrap/build/css/tempusdominus-bootstrap.css";

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import configureStore from './redux/configureStore';
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { appSagas } from './sagas';
import rootReducer from './redux/reducers';
import * as types from './redux/actions/types'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
                              || compose; // add support for Redux dev tools

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(appSagas);
export const action = (type, arg) => store.dispatch({ type, arg })

action(types.FETCH_COUNTRIES)
action(types.FETCH_STATES)
action(types.FETCH_CITIES)

ReactDOM.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
