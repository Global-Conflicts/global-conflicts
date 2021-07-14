import geodata from '../data.json';

const timeline = {
  minDate: new Date('2010-01-01'),
  maxDate: new Date(),
  selectedStartDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  selectedEndDate: new Date()
};

const incidents = Array(40).fill(
  {
    id: 'dje5d5',
    timestamp: new Date('2021-01-01'),
    plaintext: '2014 pro-Russian unrest in Ukraine: An airstrike on the rebel-held town of Snizhne kills at least eleven civilians. (AP via Washington Post)',
    richtext: '',
    regions: ['Russia'],
    link: 'https://en.wikipedia.org/wiki/Portal%3aCurrent_events/2012_November_25'
  }
);

const initialState = {
  geodata,
  timeline,
  incidents,
  selectedIncident: incidents[0],
  selectedRegion: 'Global'
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
