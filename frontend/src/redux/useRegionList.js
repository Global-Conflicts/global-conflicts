import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'

const selectGeodata = state => state.geodata;

const useRegionList = () => {
  const geodata = useSelector(selectGeodata)

  const regionList = useMemo(() => {
    const filter = (feature) => feature.properties.name;
    const regions = geodata.features.map(filter)
    return ['Global', ...regions];
  }, [geodata]);

  return regionList;
}

export default useRegionList;
