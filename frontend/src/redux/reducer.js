const timeline = {
  minDate: new Date('2010-01-01'),
  maxDate: new Date(),
  selectedStartDate: new Date(Date.now() - 1000*60*60*24 * 356),
  selectedEndDate: new Date()
};

const initialState = {
  timestamp: null,
  timeline,
  incidents: null,
  selectedLocation: null,
  selectedRegion: 'global',
  visibleIncidents: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_INCIDENTS':
      return { ...state, incidents: action.incidents, timestamp: new Date(action.timestamp) };
    case 'SET_REGION':
      return { ...state, selectedRegion: action.region };
    case 'SET_LOCATION':
      return { ...state, selectedLocation: action.location };
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
