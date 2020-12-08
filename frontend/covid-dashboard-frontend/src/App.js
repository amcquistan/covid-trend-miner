import logo from './logo.svg';
import './App.css';
import { useDispatch } from 'react-redux';
import { actionChannel } from 'redux-saga/effects';
import { action } from './index';



function App() {
  const getStates = () => {
    // useDispatch()
  }

  return (
    <div className="App">
      <button
        onClick={() => action('FETCH_STATES')}
      >
        Click me!
      </button>
    </div>
  );
}

export default App;
