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
      <label className="location__label" htmlFor="location">Location:</label>
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
      <svg className={resetClassNames} onClick={onReset} xmlns="http://www.w3.org/2000/svg" width="12" height="12">
        <path d="M 3.9,3 3,3.9 5.1,6 3,8.1 3.9,9 6,6.9 8.1,9 9,8.1 6.9,6 9,3.9 8.1,3 6,5.1 Z M 12,6 A 6,6 0 0 1 6,12 6,6 0 0 1 0,6 6,6 0 0 1 6,0 6,6 0 0 1 12,6 Z"/>
      </svg>
    </div>
  );
}

export default LocationSearch;
