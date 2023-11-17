import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useFilteredIncidents from './useFilteredIncidents'

const selectVisibleIncidents = (state) => state.visibleIncidents;

const selectSelectedLocation = (state) => state.selectedLocation;

const useIncidentMarkers = () => {
  const filteredIncidents = useFilteredIncidents();
  const visibleIncidents = useSelector(selectVisibleIncidents);
  const selectedLocation = useSelector(selectVisibleIncidents);

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

    const filterE = (incident) => {
      const { coordinates } = incident;
      return {...incident, isSelected: incident.name === selectedLocation}
    };

    return filteredIncidents.filter(filterA).map(filterB).flat().map(filterC).filter(filterD);
  }, [filteredIncidents, visibleIncidents, selectedLocation]);

  return incidentMarkers;
}

export default useIncidentMarkers;
