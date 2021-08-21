import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import './App.css';
import './Map.css';

const MY_MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJvbTAwMDIiLCJhIjoiY2tzbDd4azZtMnV0cDJ0bzJzbmtkcXowaiJ9.hXmcl4FHTVNiv6DI8SyPUQ'
mapboxgl.accessToken = MY_MAPBOX_TOKEN;

var map_center = {
    longitude: 133.7751,
    latitude: -25.2744,
    zoom: 3 //zoom range 0.0 - 22.0
};

function App() {
  //The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(map_center.longitude);
  const [lat, setLat] = useState(map_center.latitude);
  const [zoom, setZoom] = useState(map_center.zoom);

  //Ensures that Mapbox GL JS will not try to render a map before React creates the element that contains the map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      //change map style here https://docs.mapbox.com/api/maps/styles/
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom
    });
  });

  //Hook used for getting centre lat, long, zoom when map is moved
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  //return map and a sidebar with current lat, long info
  return (
    <div>
    <div className="sidebar">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <div ref={mapContainer} className="map-container" />
    </div>
    );

}

export default App;
