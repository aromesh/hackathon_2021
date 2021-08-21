import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as temperature_data from './temp_data_fix.json';

import './App.css';
import './Map.css';

import drawTriangles, { drawPoints } from './delaunay_triangulation';

var my_coords = [
  [133.7751, -25.833818],
  [132.77512, -30.833174],
  [131.7751, -26.8327],
  [130.7751, -25.832056],
  [129.7751, -30.831141],
  [128.7751, -25.830497],
  [127.7751, -30.82992],
  [126.7751, -27.829548],
  [125.7751, -25.829446],
  [124.7751, -30.828802],
  [123.7751, -29.82931],
  [122.7751, -27.830802],
  [121.7751, -27.831683],
  [120.7751, -27.832158]
  ];

const MY_MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJvbTAwMDIiLCJhIjoiY2tzbDd4azZtMnV0cDJ0bzJzbmtkcXowaiJ9.hXmcl4FHTVNiv6DI8SyPUQ'
mapboxgl.accessToken = MY_MAPBOX_TOKEN;

var MAP_CENTER = {
    longitude: 133.7751,
    latitude: -25.2744,
    zoom: 3 //zoom range 0.0 - 22.0
};

function createLegend()
{
  var layers = ['-5 - 0','0 - 5', '5 - 10', '10 - 15', '15 - 20', '25 - 30', '30 - 35', '35 - 40',];
  var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
  var legend = document.getElementById('legend')

  //create each line for legend
  for (let i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
  
    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }
}


function App({props}) {
  //The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(MAP_CENTER.longitude);
  const [lat, setLat] = useState(MAP_CENTER.latitude);
  const [zoom, setZoom] = useState(MAP_CENTER.zoom);

  //Ensures that Mapbox GL JS will not try to render a map before React creates the element that contains the map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      //change map style here https://docs.mapbox.com/api/maps/styles/
      //style: 'mapbox://styles/mapbox/satellite-v9',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    
  },[]);

  //Hook used for getting centre lat, long, zoom when map is moved
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    },[]);

    console.log(props)
    //other stuff that will be drawn
    if (props !== null && props  !== undefined)
    {
      map.current.on('load', () => {
      let req_points = props;
      console.log(req_points);
      let filtered_array = [];

      const MAX_POINTS = 300;
      var delta = Math.floor(req_points.length / MAX_POINTS);
      let triangle_points;
      if (req_points.length>MAX_POINTS){
      for (let i=0; i<req_points.length; i=i+delta)
      {
        filtered_array.push(req_points[i]);
      }
      triangle_points = filtered_array.map((elem) => [elem.lon,elem.lat, elem.temp]);
    }
    else{
      triangle_points = req_points.map((elem) => [elem.lon,elem.lat, elem.temp]);
    }

      //draw points for vertices
      drawPoints(map, triangle_points);
      //draw triangles
      if (triangle_points.length > 2){
      drawTriangles(map, triangle_points);
      }
      //create a legend
      createLegend();

    });
  }
    
  });

  //return map and a sidebar with current lat, long info
  return (
    <div>
    <div className="sidebar">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <div ref={mapContainer} className="map-container" />
    <div class='map-overlay' id='legend'></div>
    </div>
    );

}

export default App;
