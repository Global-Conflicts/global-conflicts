import { store } from './store';

export const setIncidents = (incidents, timestamp) => {
  store.dispatch({
    type: 'SET_INCIDENTS',
    incidents,
    timestamp
  });
};

export const setRegion = (region) => {
  store.dispatch({
    type: 'SET_REGION',
    region
  });
};

export const setLocation = (location) => {
  store.dispatch({
    type: 'SET_LOCATION',
    location
  });
};

export const setTimelineStart = (start) => {
  store.dispatch({
    type: 'SET_TIMELINE_START',
    start
  });
};

export const setTimelineEnd = (end) => {
  store.dispatch({
    type: 'SET_TIMELINE_END',
    end
  });
};

export const addVisibleIncident = (incidentName) => {
  store.dispatch({
    type: 'ADD_VISIBLE_INCIDENT',
    incidentName
  });
};

export const removeVisibleIncident = (incidentName) => {
  store.dispatch({
    type: 'REMOVE_VISIBLE_INCIDENT',
    incidentName
  });
};
