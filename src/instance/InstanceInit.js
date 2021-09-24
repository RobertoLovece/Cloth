import InstancePoint from './InstancePoint.js'
import InstanceStick from './InstanceStick.js'

import Stick from './stick.js'
import Point from './point.js';

//

export function initInstanceObjects(canvasW, canvasH) {

    var returnArray = [];

    var dimensions = calculateDimensions(canvasW, canvasH)
    var instanceObj = createGrid(dimensions, canvasW, canvasH);
    //var instanceObj = createTest();

    returnArray.push(instanceObj[0]);
    returnArray.push(instanceObj[1]);

    return returnArray;

}

//

function calculateDimensions(canvasW, canvasH)  {

    var returnArray = [];

    var xOffset = (1/20) * canvasW;

    var yOffsetUp = (1/20) * canvasH;
    var yOffsetDown = (1/5) * canvasH;

    var pointR = 0.14;
    var stickW = pointR * 0.6;

    if (canvasW > 22) {
        var yOffsetDown = (1/3) * canvasH;

        var xNumber = 11;
        var yNumber = 8;

        var lockedPos = []

        lockedPos.push(0);
        lockedPos.push(5);
        lockedPos.push(10);
    }
    else {
        var yOffsetDown = (1/4) * canvasH;

        var xNumber = 9;
        var yNumber = 8;

        var lockedPos = []

        lockedPos.push(0);
        lockedPos.push(4);
        lockedPos.push(8);
    }

    returnArray.push(xOffset);
    returnArray.push(yOffsetUp);
    returnArray.push(yOffsetDown);
    returnArray.push(pointR);
    returnArray.push(stickW);
    returnArray.push(xNumber);
    returnArray.push(yNumber);
    returnArray.push(lockedPos);

    return returnArray;

}

//

function createGrid(dimensions, canvasW, canvasH) {

    var returnArray = [];
    var points = [];
    var sticks = [];

    var xOffset = dimensions[0];

    var yOffsetUp = dimensions[1];
    var yOffsetDown = dimensions[2];

    var pointR = dimensions[3];
    var stickW = dimensions[4];

    var xNumber = dimensions[5];
    var yNumber = dimensions[6];

    var lockedPos = dimensions[7];

    var xCoords = [];
    
    var xStart = (canvasW / 2) - canvasW + xOffset
    var xEnd = (canvasW / 2) - xOffset;
    var xInterval = (xStart - xEnd) / (xNumber -1);

    for (let i = 0 ; i < xNumber ; i++ ) {
        xCoords.push(
            xStart + (i * - xInterval)
        );
    } 

    var yCoords = [];

    var yStart = (canvasH / 2) - canvasH + yOffsetDown
    var yEnd = (canvasH / 2) - yOffsetUp;
    var yInterval = ((yStart - yEnd) / (yNumber -1));

    for (let i = 0 ; i < yNumber ; i++ ) {
        yCoords.push(
            yEnd + (i * yInterval)
        );
    } 

    var count = 0;

    yCoords.forEach(function(y) {
        xCoords.forEach(function(x) {
            if (count == lockedPos[0] || count == lockedPos[1] || count == lockedPos[2]) {
                points.push(
                    new Point(x, y, 0, true)
                );
            } else {
                points.push(
                    new Point(x, y, 0, false)
                );
            }
            count+=1;
        });
    });

    points.forEach(function (point) {
        point.setPreviousPosition(point.position.x, point.position.y, point.position.z)
    });

    var previous = null;
    var above = null;

    points.forEach(function (current, i) {

        if (previous != null) {
            if (current.position.y == previous.position.y) {
                sticks.push(
                    new Stick(previous, current)
                );
            }
        }

        previous = current;

        if (above != null) {
            sticks.push(
                new Stick(above, current)
            );
        }

        if ((i - xNumber) >= -1) {
            above = points[i-xNumber+1];
        }

    });

    var instancePoints = new InstancePoint(points, pointR);
    var instanceSticks = new InstanceStick(sticks, stickW);

    returnArray.push(instancePoints);
    returnArray.push(instanceSticks);

    return returnArray;

}





