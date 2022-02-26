import { useMemo } from 'react';
import { useSelector } from 'react-redux'

const selectGeodata = state => state.geodata;

const global = { key: 'GLOBAL', value: 'Global' }

const useRegionList = () => {
  const geodata = useSelector(selectGeodata)

  const regionList = useMemo(() => {
    const map = (feature) => ({ 
      key: feature.properties.iso_a3,
      value: feature.properties.name 
    });

    // Filter out invalid keys
    const filter = (feature) => /[A-Z]{3}/.test(feature.key);

    const regions = geodata.features.map(map).filter(filter)
    return [global, ...regions];
  }, [geodata]);

  return regionList;
}

export default useRegionList;
