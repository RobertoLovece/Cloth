import * as THREE from 'three';

const dummy = new THREE.Object3D();

//

export default class InstanceStick {
    // takes an x and y position and size
    constructor(sticks, width) {

        this.sticks = sticks;

        // var geometry = new THREE.BoxGeometry(width, 1, width);
    
        // var material = new THREE.MeshBasicMaterial();

        // this.mesh = new THREE.InstancedMesh(geometry, material, this.sticks.length);

        // this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    }

    //

    update(delta) {

        for (let i = 0; i < this.sticks.length; i++) {
            
            var stick = this.sticks[i];

            var mid = this.centerMidPoint(stick.p0, stick.p1);

            var midX = mid.x;
            var midY = mid.y;
            var midZ = mid.z;

            dummy.position.set(midX, midY, midZ);

            var angleZ = (this.angleBetweenPointsZ(stick.p0, stick.p1)) * 1;
            if (angleZ > Math.PI/2) {
                dummy.rotation.z = -angleZ;
            }
            else {
                dummy.rotation.z = angleZ;
            }

            dummy.updateMatrix();

            var angleX = (this.angleBetweenPointsX(stick.p0, stick.p1)) * 1;
            if (angleX > Math.PI/2) {
                // dummy.rotation.x = Math.PI - angleX;
                dummy.rotation.x = angleX;
            }
            else {
                dummy.rotation.x = - angleX;
            }
        
            var dist = stick.distance(stick.p0, stick.p1);
            dummy.scale.set(1,dist,1);

            dummy.updateMatrix();

            // this.mesh.setMatrixAt(i, dummy.matrix);

            // var color = new THREE.Color(stick.defaultColor);

            // this.mesh.setColorAt(i, color);

            stick.updateStick(delta);

        }

        // this.mesh.instanceMatrix.needsUpdate = true;
        // this.mesh.instanceColor.needsUpdate = true;
    }

    //

    updateSticks(delta) {

        for (let i = 0; i < this.sticks.length; i++) {
            sticks[i].updateStick(delta);
        }
    }

    //

    centerMidPoint(p0, p1) {

        var midX = p1.position.x - ((p1.position.x - p0.position.x) / 2);
        var midY = p1.position.y - ((p1.position.y - p0.position.y) / 2);
        var midZ = p1.position.z - ((p1.position.z - p0.position.z) / 2);

        return new THREE.Vector3(midX, midY, midZ);

    }

    //

    angleBetweenPointsX(p0,p1) {
        var deltaY = p1.position.y - p0.position.y;
        var deltaZ = p1.position.z - p0.position.z;

        return Math.atan2(deltaY, deltaZ) + (90 * Math.PI/180);
    }
    
    //

    angleBetweenPointsY(p0,p1) {
        var deltaX = p1.position.x - p0.position.x;
        var deltaZ = p1.position.z - p0.position.z;

        return Math.atan2(deltaX, deltaZ) + (90 * Math.PI/180);
    }
    
    //

    angleBetweenPointsZ(p0, p1) {
        var deltaY = p1.position.y - p0.position.y;
        var deltaX = p1.position.x - p0.position.x;

        return Math.atan2(deltaY, deltaX) + (90 * Math.PI/180);
    }

}