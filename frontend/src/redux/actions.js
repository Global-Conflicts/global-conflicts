import { store } from './store';

export const setRegion = (region) => {
  store.dispatch({
    type: 'SET_REGION',
    region
  });
};

export const setIncident = (incident) => {
  store.dispatch({
    type: 'SET_INCIDENT',
    incident
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
