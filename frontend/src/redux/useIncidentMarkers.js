import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useFilteredIncidents from './useFilteredIncidents'

const selectVisibleIncidents = (state) => state.visibleIncidents;

const useIncidentMarkers = () => {
  const filteredIncidents = useFilteredIncidents();
  const visibleIncidents = useSelector(selectVisibleIncidents);

  const incidentMarkers = useMemo(() => {
    if (!filteredIncidents) return null;
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

    const filterD = (incident) => (visibleIncidents.includes(incident.name));

    return filteredIncidents.filter(filterA).map(filterB).flat().map(filterC).filter(filterD);
  }, [filteredIncidents, visibleIncidents]);

  return incidentMarkers;
}

export default useIncidentMarkers;
