import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'
import { setRegion } from './redux/actions.js'

const selectRegions = state => state.regions;
const selectSelectedRegion = state => state.selectedRegion;

const sanitizeId = (str) => 
  encodeURIComponent(str)
    .toLowerCase()
    .replace(/\.|%[0-9a-z]{2}/gi, '');

const LocationSearch = () => {
  const regions = useSelector(selectRegions)
  const regionsWithIds = useMemo(() => 
    regions.map((region) => ({key: sanitizeId(region), value: region}))
  , [regions]);
  
  const selectedRegion = useSelector(selectSelectedRegion)
  const selectedRegionId = useMemo(() => 
    sanitizeId(selectedRegion)
  , [selectedRegion]);

  const onChange = useCallback(({ target }) => {
    setRegion(target.value);
  }, [regionsWithIds]);

  return (
    <div className="location">
      <label className="location__label" htmlFor="location">Location</label>
      <select 
        id="location"
        className="location__select"
        value={ selectedRegionId }
        onChange={ onChange }
      >
        {
          regionsWithIds.map(region => 
            <option value={region.key} value={region.key}>{region.value}</option>)
        }
      </select>
    </div>
  );
}

export default LocationSearch;
