import React from 'react';
import Main from './Main';
import Map from './Map';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { setIncidents } from './redux/actions';


async function loadDataAsync() {
  const { incidents, timestamp } = await import("./data/incidents.json");
  const filtered_incidents = incidents.map((i) => ({...i, timestamp: new Date(i.date)})).reverse();
  setIncidents(filtered_incidents, timestamp);
}

function App() {
  loadDataAsync();
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
