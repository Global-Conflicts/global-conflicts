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
    const jsonString = e.features[0].properties.data
    const incident = JSON.parse(jsonString);
    incident['timestamp'] = new Date(incident['timestamp']);
    setIncident(incident);
    
    e.originalEvent.preventDefault();
  }, [setIncident]);

  const onClusterClick = useCallback((e) => {
    if (!map) return;

    const coordinates = e.features[0].geometry.coordinates;
    const zoom = map.getZoom();

    console.log(coordinates, zoom);

    map.easeTo({
      center: coordinates,
      zoom: zoom + 1
    });
  }, [map]);

  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (!map) return;
    if (popup) popup.remove();
    if (!selectedIncident) return;

    const html = ReactDOMServer.renderToString(<Marker {...selectedIncident}></Marker>)

    const newPopup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(selectedIncident.coordinates[0])
      .setHTML(html)
      .addTo(map);

    setPopup(newPopup);

  }, [selectedIncident, map])

  useEffect(() => {
    if (!map) return;

    map.getSource('incidents').setData(incidentMarkers);

  }, [map, incidentMarkers])

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
        data: incidentMarkers,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'incidents',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            20,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            20,
            20,
            30
          ]
        }
      });
         
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'incidents',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });
         
      map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'incidents',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': '{icon}',
          'icon-allow-overlap': true
        }
      });

      map.on('click', 'clusters', onClusterClick);

      map.on('click', 'unclustered-point', onIncidentClick);

      map.on('dblclick', 'countries', onCountryClick);
       
      /*
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });
      */

      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
      });

      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, [setMap]);

  return (
    <div ref={mapContainerRef} className='map-container' />
  );
};

export default Map;
