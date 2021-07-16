import React, { useMemo, useCallback } from 'react';
import useFilteredIncidents from './useFilteredIncidents'

const useIncidentMarkers = () => {
  const filteredIncidents = useFilteredIncidents();

  const incidentMarkers = useMemo(() => {
    const filter = (i) => (
      {
        type: 'Feature',
        properties: {
          data: i,
          icon: 'theatre-15'
        },
        geometry: {
          type: 'Point',
          coordinates: [-77.038659, 38.931567]
        }
      }
    );

    const features = filteredIncidents.map(filter);
    return {
      type: 'FeatureCollection',
      features: features
    }
  }, [filteredIncidents]);

  return incidentMarkers;
}

export default useIncidentMarkers;
