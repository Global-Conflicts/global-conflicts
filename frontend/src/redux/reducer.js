import geodata from '../data/geodata.json';
import { incidents } from '../data/incidents.json';

const filtered_incidents = incidents.map((i) => ({...i, timestamp: new Date(i.date)})).reverse();

const timeline = {
  minDate: new Date('2010-01-01'),
  maxDate: new Date(),
  selectedStartDate: new Date(Date.now() - 1000*60*60*24 * 356),
  selectedEndDate: new Date()
};

const initialState = {
  geodata,
  timeline,
  incidents: filtered_incidents,
  selectedIncident: filtered_incidents[0],
  selectedRegion: 'global'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_REGION':
      return { ...state, selectedRegion: action.region };
    case 'SET_INCIDENT':
      return { ...state, selectedIncident: action.incident };
    case 'SET_TIMELINE_START':
      return { ...state, timeline: { ...state.timeline, selectedStartDate: action.start } };
    case 'SET_TIMELINE_END':
      return { ...state, timeline: { ...state.timeline, selectedEndDate: action.end } };
    default:
      return state;
  }
}

export { reducer, initialState };
