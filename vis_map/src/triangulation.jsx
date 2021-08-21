import Delaunator from 'delaunator';
import seedrandom from "seedrandom";
import { generate_grid } from "./points";


// function _random_from_palette(rand) {
//     const keys = Object.keys(colorbrewer);
  
//     return colorbrewer[keys[Math.floor(rand() * keys.length)]];
// }
  
// function _map(num, in_range, out_range) {
//     return (
//         ((num - in_range[0]) * (out_range[1] - out_range[0])) /
//         (in_range[1] - in_range[0]) +
//         out_range[0]
//     );
// }

// function _clamp(num, interval) {
//     return Math.min(Math.max(num, interval[0]), interval[1]);
// }
function Triangulation(props) {

    const {
        width = 400,
        height = 400,
        cell_size = 20,
        variance = 1,
        seed = "1",
        color_space = "lab", // Color space used for gradient construction & interpolation
        stroke_width = 1.01
        // palette = colorbrewer, // Palette to use for 'random' color option
    } = props;

    const rand = seedrandom(seed);

    // const x_color = _random_from_palette(rand);
    // const y_colors = _random_from_palette(rand);

    // const x_colorr = chroma.scale(x_color).mode(color_space);
    // const y_colorr = chroma.scale(y_colors).mode(color_space);

    function centroid_calc(d) {
        return {
        x: (d[0][0] + d[1][0] + d[2][0]) / 3,
        y: (d[0][1] + d[1][1] + d[2][1]) / 3
        };
    }

    // const gradient = function(x, y) {
    //     return chroma.interpolate(x_colorr(x), y_colorr(y), 0.5, color_space);
    // };

    var cells_x = Math.floor((width + 4 * cell_size) / cell_size);
    var cells_y = Math.floor((height + 4 * cell_size) / cell_size);
  
    const bleed_x = (cells_x * cell_size - width) / 2;
    const bleed_y = (cells_y * cell_size - height) / 2;
  
    const variancePoint = (cell_size * variance) / 2;

    // const norm_x = function(x) {
    //     return _clamp(_map(x, [0, width], [0, 1]), [0, 1]);
    // };

    // const norm_y = function(y) {
    //     return _clamp(_map(y, [0, height], [0, 1]), [0, 1]);
    // };

    const points = generate_grid(
        width,
        height,
        bleed_x,
        bleed_y,
        cell_size,
        variancePoint,
        rand
    );

    const delaunay = new Delaunator(points.flat());
    //const delaunay = Delaunay.from([[0, 0], [0, 1], [1, 0], [1, 1]]);

    var geom_indices = delaunay.triangles;
    var triangles = [];

    for (let i = 0; i < geom_indices.length; i += 3) {
        var vertices = [
            geom_indices[i],
            geom_indices[i + 1],
            geom_indices[i + 2]
        ].map(i => points[i]);
        //var centroid = centroid_calc(vertices);
        var color;
        //var color = gradient(norm_x(centroid.x), norm_y(centroid.y)).css();
        color = 'rgb(0,155,220)';
        triangles.push([color, vertices]);
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width}>
        {triangles.map((poly,index) => {
            return (
                <path
                    key={index}
                    d={`M${poly[1].join("L")}Z`}
                    //fill={poly[0]}
                    stroke={poly[0]}
                    strokeWidth={stroke_width}
                /> 
            );
        })}
    </svg>
    );
}


export default Triangulation;