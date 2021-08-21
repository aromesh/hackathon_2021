//  map stuff starts    //
mapboxgl.accessToken = 'pk.eyJ1IjoiYWFobTAwNDIiLCJhIjoiY2tnOGFiZnUyMGRnNzJycGRndmI4dDZhbiJ9.1_vsE3aPBjxtFKn9nergsw';
const bounds = [
    [100, -48], // Southwest coordinates
    [170, 0] // Northeast coordinates
];
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [135, -24], // starting position
    zoom: 3, // starting zoom
    maxBounds: bounds // Set the map's geographical boundaries.
});
map.dragRotate.disable();
//  map stuff ends  //
//dummy data
colors = ['#FF5733','#FEFF33','#63FF33','#33FFDB','#3343FF'];
Vertex1 = [140, -20,1];
Vertex2 = [136, -23,2];
Vertex3 = [144, -23,3];
Vertex4 = [140, -26,4];
Vertex5 = [132, -26,5];
Vertex6 = [148, -26,6];
Triangle0 = ['a0',Vertex1, Vertex2, Vertex3];
Triangle1 = ['a1',Vertex4, Vertex2, Vertex3];
Triangle2 = ['a2',Vertex4, Vertex2, Vertex5];
Triangle3 = ['a3',Vertex4, Vertex3, Vertex6];
ArrayOfTriangles = [Triangle0, Triangle1, Triangle2, Triangle3];


//functions to edit whats on map
function drawTriangles(ArrayOfTriangles) {
    for (let i = 0; i < ArrayOfTriangles.length; i++) {
        Triangle = ArrayOfTriangles[i];
        v1 = Triangle[1];
        v2 = Triangle[2];
        v3 = Triangle[3];
        data = 1 / 3 * (v1[2] + v2[2] + v3[2]);
        id = Triangle[0];
        //  Add a new source
        map.addSource(id, {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    // These coordinates outline Maine.
                    'coordinates': [
                        [
                            [v1[0],v1[1]],
                            [v2[0],v2[1]],
                            [v3[0],v3[1]],
                        ]
                    ]
                }
            }
        });
        // Add a new layer to visualize the polygon.
        map.addLayer({
            'id': id,
            'type': 'fill',
            'source': id, // reference the data source
            'layout': {},
            'paint': {
                'fill-color': colors[i], // blue color fill
                'fill-opacity': 0.5
            }
        });
    }
}



function eraseTriangles(ArrayOfTriangles) {
    for (let i = 0; i < ArrayOfTriangles.length; i++) {
        id = ArrayOfTriangles[i][0];
        map.removeLayer(id)
        map.removeSource(id)
    }
}

function toggleCheck() {
    if(document.getElementById("list-switch-1").checked === true){
        drawTriangles(ArrayOfTriangles)
    } else {
        eraseTriangles(ArrayOfTriangles)
    }
  }