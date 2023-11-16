import React from 'react';
import useIncidentMarkers from './redux/useIncidentMarkers.js';

import LocationMarker from './components/LocationMarker.js';

import Map, {NavigationControl, Marker} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const selectZoom = (state) => state.zoom;
const selectCenter = (state) => state.center;


const WorldMap = () => {
  const incidentMarkers = useIncidentMarkers();

  return  <Map 
    initialViewState={{
      longitude: 30,
      latitude: 50,
      zoom: 2,
    }}
    mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    className="map"
    doubleClickZoom={false}
  >
    <NavigationControl position="top-left" />
    {incidentMarkers && incidentMarkers.map((incident) => 
      <Marker
        key={`${incident.key}-${incident.name}`}
        longitude={incident.coordinates[0]}
        latitude={incident.coordinates[1]}
        anchor="bottom">
        <LocationMarker name={incident.name} />
      </Marker>
    )}
  </Map>
};

/**
const selectGeodata = state => state.geodata;
const selectSelectedIncident = state => state.selectedIncident;

const oldMap = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  const geodata = useSelector(selectGeodata)
  const selectedIncident = useSelector(selectSelectedIncident)
  const incidentMarkers = useIncidentMarkers();

  const onCountryClick = useCallback((e) => {
    if (e.originalEvent.defaultPrevented) return;

    const countryId = e.features[0].properties.iso_a3
    setRegion(countryId);
  }, [setRegion]);

  const onIncidentClick = useCallback((e) => {
    const jsonString = e.features[0].properties.data
    const incident = JSON.parse(jsonString);
    incident['timestamp'] = new Date(incident['timestamp']);
    setIncident(incident);
    
    e.originalEvent.preventDefault();
  }, [setIncident]);

  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (!map) return;
    if (popup) popup.remove();
    if (!selectedIncident) return;

    const html = ReactDOMServer.renderToString(<Marker {...selectedIncident}></Marker>)

    const [lat, lng] = selectedIncident.coordinates[0];

    const newPopup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat([lng, lat])
      .setHTML(html)
      .addTo(map);

    setPopup(newPopup);

    map.easeTo({
      center: [lng, lat]
    });

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
            'fill-color': 'rgba(0, 0, 0, 0)'
          },
        },
        'country-label'
      );

      map.addSource('incidents', {
        type: 'geojson',
        data: incidentMarkers,
        cluster: true,
        clusterMaxZoom: 4, // Max zoom to cluster points on
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

      map.on('click', 'clusters', (e) => map.easeTo({center: e.lngLat, zoom: map.getZoom() + 2}));

      map.on('click', 'unclustered-point', onIncidentClick);

      map.on('dblclick', 'countries', onCountryClick);
       
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });

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
**/

export default WorldMap;
