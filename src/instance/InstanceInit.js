import InstancePoint from './InstancePoint.js'

import Point from './point.js';
import Stick from './stick.js';

//

export function initInstanceObjects(width, height) {

    var returnArray = [];

    var points = [];

    for (let h = 0 ; h < height ; h++) {   
        for (let w = 0 ; w < width ; w++) {
            points.push(
                new Point(w, -h, 0, false)
            );
        }
    }

    var sticks = []

    var stick;

    for (let i = 0 ; i < points.length ; i++) {
        if (((i+1) % width) != 0) {
            //left to right
            stick = new Stick(points[i], points[i+1]);
            sticks.push(stick);

            
        }
        
        //top to bottom   
        if (i < ((points.length-width))) {
            stick = new Stick(points[i], points[i+width]);
            sticks.push(stick);
        }
    }

    points[0].toggleLocked();
    points[width-1].toggleLocked();
    points[(Math.round(width/2)-1)].toggleLocked();

    console.log(sticks)

    var instancePoints = new InstancePoint(points, 0.1);

    returnArray.push(instancePoints);
    returnArray.push(sticks);

    return returnArray;

}