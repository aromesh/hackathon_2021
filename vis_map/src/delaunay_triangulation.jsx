import { Delaunay } from "d3-delaunay";
import {interpolateRdYlBu} from "d3-scale-chromatic"
import {geoVoronoi} from "d3-geo-voronoi"

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


function Triangulator(points) {
    
    var triangle_pts = [];
    var data = [];
    data = Delaunay.from(points);  
      
    var geom_indices = data.triangles;

    for (let i = 0; i < geom_indices.length; i += 3) {

        var unique_ID = ""+geom_indices[i]+geom_indices[i+1]+geom_indices[i+2]+points[geom_indices[i]];
        var vertices = [unique_ID,
            points[geom_indices[i]],
            points[geom_indices[i + 1]],
            points[geom_indices[i + 2]]
        ];

        triangle_pts.push(vertices);
    }
    return triangle_pts;
}

function getColorValue(value, min_value, max_value)
{
    //scaled between 0 and 1
    var number = (value-min_value)/(max_value-min_value);
    return interpolateRdYlBu(number);
}

//functions to edit whats on map
function drawTriangles(map, points) {

    var ArrayOfTriangles = Triangulator(points);

    for (let i = 0; i < ArrayOfTriangles.length; i++) {
        var Triangle = ArrayOfTriangles[i];
        var v1 = Triangle[1];
        var v2 = Triangle[2];
        var v3 = Triangle[3];
        var data = 1 / 3 * (v1[2] + v2[2] + v3[2]);
        var id = Triangle[0];

        var max_value = points.reduce((x,y) => x>y[2] ? x : y[2]);
        var min_value = points.reduce((x,y) => x<y[2] ? x : y[2]);

        //getColorValue(data, min_value, max_value);
        //  Add a new source
        map.current.addSource(id, {
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
        map.current.addLayer({
            'id': id,
            'type': 'fill',
            'source': id, // reference the data source
            'layout': {},
            'paint': {
                'fill-color': getColorValue(data, min_value, max_value), // blue color fill
                'fill-opacity': 0.5,
            }
        });
    }
}

export function drawPoints(map, points)
{
    let route = + new Date();
    route = route.toString();
    map.current.addSource(route, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
            'type': 'LineString',
            'coordinates': points,
            }
        }
    })
    map.current.addLayer({
        'id': route,
        'type': 'circle',
        'source': route,
        'layout': {
        },

        'paint': {
        // Make circles larger as the user zooms from z12 to z22.
        'circle-radius': {
        'base': 1.75,
        'stops': [
        [12, 2],
        [22, 180]
        ]
        },
        'circle-color': '#000000'
        },
    });
} 


export default drawTriangles;