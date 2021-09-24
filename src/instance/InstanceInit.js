import InstancePoint from './InstancePoint.js'

import Point from './point.js';

//

export function initInstanceObjects(width, height) {

    var points = [];

    for (let h = 0 ; h < height ; h++) {   
        for (let w = 0 ; w < width ; w++) {
            points.push(
                new Point(w, -h, 0, false)
            );
        }
    }

    var instancePoints = new InstancePoint(points, 0.1);

    return instancePoints;

}