import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'

const selectIncidents = state => state.incidents;
const selectSelectedStartDate = state => state.timeline.selectedStartDate;
const selectSelectedEndDate = state => state.timeline.selectedEndDate;
const selectSelectedRegion = state => state.selectedRegion;

const useFilteredIncidents = () => {
  const incidents = useSelector(selectIncidents)
  const selectedStartDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const selectedRegion = useSelector(selectSelectedRegion)

  const filteredIncidents = useMemo(() => {
    const filter = (i) => (
      i.timestamp >= selectedStartDate &&
      i.timestamp <= selectedEndDate &&
      (selectedRegion === 'global' || 
      (i.regions && i.regions.map(s => s.toLowerCase()).includes(selectedRegion)))
    );
    return incidents.filter(filter);
  }, [incidents, selectedStartDate, selectedEndDate, selectedRegion]);

  return filteredIncidents;
}

export default useFilteredIncidents;
