import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import configureStore from './redux/configureStore';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { covidDataAll } from './sagas/covidDataAll';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore(sagaMiddleware);
sagaMiddleware.run(covidDataAll);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
