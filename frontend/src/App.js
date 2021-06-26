import React from 'react';
import Map from './Map';
import Sidebar from './Sidebar';
import Timeline from './Timeline';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <div>
        <Map />
        <Sidebar />
        <Timeline />
      </div>
    </Provider>
  );
}

export default App;
