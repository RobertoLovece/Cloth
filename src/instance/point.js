import { Vector3 } from 'three';

const bounce = 0.9;
const wind = 0;
const friction = 0.999;

//

export default class Point {

    constructor(x, y, z, locked) {

        this.position = new Vector3(x, y, z);
        this.prevPosition;
        this.locked = locked

        if (this.locked) {
            this.defaultColor = 0xff5382;
        }
        else {
            this.defaultColor = 0xffffff;
            // this.defaultColor = 0x808080;
        }

        this.setPreviousPosition(x, y, z);

    }

    //

    test() {
        this.position.z += 0.005;
    }

    //

    setPreviousPosition(prevX, prevY, prevZ) {
        this.prevPosition = new Vector3(prevX, prevY, prevZ);
    }

    //

    updatePoint(delta, gravity) {

        if (!this.locked) {

            var vx = (this.position.x - this.prevPosition.x) * friction;
            var vy = (this.position.y - this.prevPosition.y) * friction;
            var vz = (this.position.z - this.prevPosition.z) * friction;

            this.prevPosition.x = this.position.x;
            this.prevPosition.y = this.position.y;
            this.prevPosition.z = this.position.z;

            this.position.x += vx; 
            this.position.y += vy;
            this.position.z += vz;

            var g = gravity;
            g /= (1000/30);

            this.position.y += g * delta;

            var w = wind;

            this.position.z += w * delta;

        }

    }

    //

    constrainPoint(sceneW, sceneH) {

        if (!this.locked) {

            var vx = (this.position.x - this.prevPosition.x) * friction;
            var vy = (this.position.y - this.prevPosition.y) * friction;

            if (this.position.x > sceneW / 2) {
                this.position.x = sceneW / 2;
                this.prevPosition.x = this.position.x + vx * bounce;
            }
            else if (this.position.x < -sceneW / 2) {
                this.position.x = -sceneW / 2;
                this.prevPosition.x = this.position.x + vx * bounce;
            }

            if (this.position.y > sceneH / 2) {
                this.position.y = sceneH / 2;
                this.prevPosition.y = this.position.y + vy * bounce;
            }
            else if (this.position.y < -sceneH / 2) {
                this.position.y = -sceneH / 2;
                this.prevPosition.y = this.position.y + vy * bounce;
            }

        }

    }

    //

    toggleLocked() {
        
        this.locked = !this.locked;

        this.updateColor();
        
    }

    //

    updateColor() {

        if (this.locked) {
            this.defaultColor = 0xff5382;
        }
        else {
            this.defaultColor = 0xffffff;
        }

    }
}
