import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'
import { setRegion } from './redux/actions.js'
import useRegionList from './redux/useRegionList.js'

const selectSelectedRegion = state => state.selectedRegion;


const LocationSearch = () => {
  const regions = useRegionList()
  
  const selectedRegion = useSelector(selectSelectedRegion)

  const onChange = useCallback(({ target }) => {
    setRegion(target.value);
  }, []);

  return (
    <div className="location">
      <label className="location__label" htmlFor="location">Location</label>
      <select 
        id="location"
        className="location__select"
        value={ selectedRegion }
        onChange={ onChange }
      >
        {
          regions.map(region => 
            <option key={region.key} value={region.key}>{region.value}</option>)
        }
      </select>
    </div>
  );
}

export default LocationSearch;
