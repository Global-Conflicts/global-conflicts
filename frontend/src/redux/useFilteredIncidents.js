import { useMemo } from 'react';
import { useSelector } from 'react-redux'

const selectIncidents = state => state.incidents;
const selectSelectedStartDate = state => state.timeline.selectedStartDate;
const selectSelectedEndDate = state => state.timeline.selectedEndDate;
const selectSelectedRegion = state => state.selectedRegion;

const datesEqual = (date1, date2) => (
  date1 && date2 &&
  (date1.getFullYear() === date2.getFullYear()) &&
  (date1.getMonth() === date2.getMonth()) &&
  (date1.getDate() === date2.getDate())
);

const useFilteredIncidents = () => {
  const incidents = useSelector(selectIncidents)
  const selectedStartDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const selectedRegion = useSelector(selectSelectedRegion)

  const filteredIncidents = useMemo(() => {
    if (!incidents) return null;
    const filter = (i) => (
      Object.values(i.coordinates).length > 0 &&
      i.timestamp >= selectedStartDate &&
      i.timestamp <= selectedEndDate &&
      (selectedRegion === 'global' || 
      (i.regions && i.regions.includes(selectedRegion)))
    );
    let lastDate = null;
    const map = (i) => {
      const firstOfDate = !datesEqual(lastDate, i.timestamp);
      lastDate = i.timestamp;
      return {...i, firstOfDate: firstOfDate};
    };
    return incidents.filter(filter).map(map);
  }, [incidents, selectedStartDate, selectedEndDate, selectedRegion]);

  return filteredIncidents;
}

export default useFilteredIncidents;
