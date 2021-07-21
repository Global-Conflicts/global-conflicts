import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'
import { setRegion } from './redux/actions.js'
import useRegionList from './redux/useRegionList.js'
import classList from './helpers/classList.js'

const selectSelectedRegion = state => state.selectedRegion;


const LocationSearch = () => {
  const regions = useRegionList()
  
  const selectedRegion = useSelector(selectSelectedRegion)

  const onChange = useCallback(({ target }) => {
    setRegion(target.value);
  }, []);

  const onReset = useCallback(({ target }) => {
    setRegion('global');
  }, []);

  const resetClassNames = classList({
    'location__reset': true,
    'location__reset--hidden': selectedRegion === 'global',
  });

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
      <button className={resetClassNames} onClick={onReset}>
        Reset
    </button>
    </div>
  );
}

export default LocationSearch;
