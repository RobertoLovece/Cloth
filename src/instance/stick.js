
export default class Stick{
    constructor(point0, point1) {

        this.p0 = point0;
        this.p1 = point1;
        this.defaultColor = 0x999bbc;

        this.length = this.distance(this.p0, this.p1);

    }

    //

    distance(p0, p1) {
        var dx = p1.position.x - p0.position.x;
        var dy = p1.position.y - p0.position.y;
        var dz = p1.position.z - p0.position.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    //

    updateStick(delta) {
        var dx = this.p1.position.x - this.p0.position.x;
        var dy = this.p1.position.y - this.p0.position.y;
        var dz = this.p1.position.z - this.p0.position.z;

        var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        var difference = this.length - distance;
        var percent = difference / distance / 2;

        var offsetX = (dx * percent);
        var offsetY = (dy * percent);
        var offsetZ = (dz * percent);

        if(!this.p0.locked) {
            this.p0.position.x -= (offsetX);
            this.p0.position.y -= (offsetY);
            this.p0.position.z -= (offsetZ);
        }

        if(!this.p1.locked) {
            this.p1.position.x += offsetX;
            this.p1.position.y += offsetY; 
            this.p1.position.z += offsetZ; 
        }

    }
}