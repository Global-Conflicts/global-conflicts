import React, { 
  useRef, 
  useEffect,
  useState,
  useCallback
} from 'react';
import ReactDOMServer from 'react-dom/server';
import mapboxgl from 'mapbox-gl';
import { useSelector } from 'react-redux'
import { setRegion, setIncident } from './redux/actions.js'
import useIncidentMarkers from './redux/useIncidentMarkers.js'
import sanitizeId from './redux/sanitizeId.js'
import Marker from './Marker.js'

const selectGeodata = state => state.geodata;
const selectSelectedIncident = state => state.selectedIncident;

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  const geodata = useSelector(selectGeodata)
  const selectedIncident = useSelector(selectSelectedIncident)
  const incidentMarkers = useIncidentMarkers();

  const onCountryClick = useCallback((e) => {
    if (e.originalEvent.defaultPrevented) return;

    const country = e.features[0].properties.name
    const countryId = sanitizeId(country);
    setRegion(countryId);
  }, [setRegion]);

  const onIncidentClick = useCallback((e) => {
    const incident = e.features[0].properties.data
    setIncident(JSON.parse(incident));
    
    e.originalEvent.preventDefault();
  }, [setIncident]);


  const popup = new mapboxgl.Popup({ closeOnClick: true });

  useEffect(() => {
    if (!map) return;
    if (!selectedIncident) popup.remove();

    const html = ReactDOMServer.renderToString(<Marker {...selectedIncident}></Marker>)

    popup
    .remove()
    .setLngLat(selectedIncident.coordinates)
    .setHTML(html)
    .addTo(map);
  }, [selectedIncident, map])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [5, 34],
      zoom: 1.5,
      doubleClickZoom: false
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
                'true', '#64bdbb',
                'rgba(0, 0, 0, 0)'
            ],
            'fill-opacity': 0,
          },
        },
        'country-label'
      );

      map.addSource('incidents', {
        type: 'geojson',
        data: incidentMarkers
      });

      map.addLayer({
        id: 'incidents',
        type: 'symbol',
        source: 'incidents',
        layout: {
          'icon-image': '{icon}',
          'icon-allow-overlap': true
        }
      });

      map.on('click', 'incidents', onIncidentClick);

      map.on('dblclick', 'countries', onCountryClick);
       
      map.on('mouseenter', 'incidents', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'incidents', () => {
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
