import geodata from '../data/geodata.json';
import { timestamp, incidents } from '../data/incidents.json';

const filtered_incidents = incidents.map((i) => ({...i, timestamp: new Date(i.date)})).reverse();

const timeline = {
  minDate: new Date('2010-01-01'),
  maxDate: new Date(),
  selectedStartDate: new Date(Date.now() - 1000*60*60*24 * 356),
  selectedEndDate: new Date()
};

const initialState = {
  timestamp: new Date(timestamp),
  geodata,
  timeline,
  incidents: filtered_incidents,
  selectedIncident: null,
  selectedRegion: 'global',
  visibleIncidents: [],
  center: [25, 50],
  zoom: [3.5]
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
    case 'ADD_VISIBLE_INCIDENT':
      const { visibleIncidents } = state;
      return { ...state, visibleIncidents: [...visibleIncidents, action.incidentName] };
    case 'REMOVE_VISIBLE_INCIDENT':
      const visibleIncidents2 = [...state.visibleIncidents];
      const index = visibleIncidents2.indexOf(action.incidentName);
      if (index > -1) {
          visibleIncidents2.splice(index, 1);
      }
      return { ...state, visibleIncidents: visibleIncidents2 };
    default:
      return state;
  }
}

export { reducer, initialState };
