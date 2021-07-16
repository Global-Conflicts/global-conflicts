import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'
import sanitizeId from './sanitizeId.js'

const selectGeodata = state => state.geodata;

const global = { key: 'global', value: 'Global' }

const useRegionList = () => {
  const geodata = useSelector(selectGeodata)


  const regionList = useMemo(() => {
    const filter = (feature) => ({ 
      key: sanitizeId(feature.properties.name),
      value: feature.properties.name 
    });
    const regions = geodata.features.map(filter)
    return [global, ...regions];
  }, [geodata]);

  return regionList;
}

export default useRegionList;
