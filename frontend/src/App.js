import React from 'react';
import Main from './Main';
import Map from './Map';
import { Provider } from 'react-redux';
import { store } from './redux/store';


function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Map />
        <Main />
      </div>
    </Provider>
  );
}

export default App;
