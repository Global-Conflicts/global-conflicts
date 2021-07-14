import React, { 
  useRef, 
  useEffect,
  useState,
  useCallback
} from 'react';
import mapboxgl from 'mapbox-gl';
import { useSelector } from 'react-redux'
import { setRegion } from './redux/actions.js'

const selectGeodata = state => state.geodata;

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  const geodata = useSelector(selectGeodata)

  const onCountryClick = useCallback((e) => {
    const country = e.features[0].properties.name
    setRegion(country);
  }, [setRegion]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [5, 34],
      zoom: 1.5
    });

    map.on('load', () => {
      map.addSource('countries', {
        type: 'geojson',
        data: geodata
      });

      map.addLayer(
        {
          id: 'countries',
          source: 'countries',
          type: 'fill',
          paint: {
            'fill-color': [
                'match',
                ['get', 'selected'],
                'true', '#64bdbb', // if selected true, paint in blue
                'rgba(0, 0, 0, 0)' // else paint in gray
            ],
            'fill-opacity': 0,
          },
        },
        'country-label'
      );

      // https://github.com/mapbox/mapbox-react-examples/tree/master/data-overlay-redux/src
      // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/
      /*
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      */

      map.on('click', 'countries', onCountryClick);
       
      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'countries', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
       
      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'countries', () => {
        map.getCanvas().style.cursor = '';
      });

      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className='map-container' />
    </div>
  );
};

export default Map;
