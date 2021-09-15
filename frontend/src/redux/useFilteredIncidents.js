import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'

const selectIncidents = state => state.incidents;
const selectSelectedStartDate = state => state.timeline.selectedStartDate;
const selectSelectedEndDate = state => state.timeline.selectedEndDate;
const selectSelectedRegion = state => state.selectedRegion;

const randomize = ([lng, lat]) => {
  const radius = .1
  const angle = Math.random() * Math.PI * 2;
  return [
    lng + Math.cos(angle) * radius, 
    lat + Math.sin(angle) * radius
  ]
};

const useFilteredIncidents = () => {
  const incidents = useSelector(selectIncidents)
  const selectedStartDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const selectedRegion = useSelector(selectSelectedRegion)

  const filteredIncidents = useMemo(() => {
    const filter = (i) => (
      i.coordinates.length > 0 &&
      i.timestamp >= selectedStartDate &&
      i.timestamp <= selectedEndDate &&
      (selectedRegion === 'global' || 
      (i.regions && i.regions.includes(selectedRegion)))
    );
    const map = (i) => {
      const { coordinates } = i;
      const randomizedCoordinates = coordinates.map(randomize);
      return {...i, coordinates: randomizedCoordinates }
    };

    return incidents.filter(filter).map(map);
  }, [incidents, selectedStartDate, selectedEndDate, selectedRegion]);

  return filteredIncidents;
}

export default useFilteredIncidents;
