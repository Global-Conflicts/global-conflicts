import { useMemo } from 'react';

import useFilteredIncidents from './useFilteredIncidents'


const useIncidentMarkers = () => {
  const filteredIncidents = useFilteredIncidents();

  const incidentMarkers = useMemo(() => {
    const filterA = ({ coordinates }) => (Object.values(coordinates).length > 0);

    const filterB = (incident) => {
      const { coordinates } = incident;
      return Object.entries(coordinates).map(([name, c]) => ({...incident, name: name, coordinates: [c]}))
    };

    const filterC = (incident) => {
      const coordinates = Object.values(incident['coordinates'])
      const [lat, lng] = coordinates[0];
      return {...incident, coordinates: [lng, lat]}
    };

    return filteredIncidents.filter(filterA).map(filterB).flat().map(filterC);
  }, [filteredIncidents]);

  return incidentMarkers;
}

export default useIncidentMarkers;
