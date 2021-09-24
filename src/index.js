import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { initInstanceObjects } from './instance/InstanceInit.js';

require('normalize.css/normalize.css');
require("./index.css");

//

let renderer, scene, camera, controls;
let container, stats, clock;
let instancePoints, shapeGeometry, shape, sticks;
let dist, order;

//

window.onload = function () {

    dist = 15;

    init();
    initObjects();
    initControls();
    initStats();

    animate();
}

//

function init() {

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('canvas');
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, dist);

    scene = new THREE.Scene();

    camera.position.set(50, 12, 50);
    camera.lookAt(0, 0, 0);

}

//

function initObjects() {

    const width = 51;
    const height = 50;

    var obj = initInstanceObjects(width, height);
    instancePoints = obj[0];
    sticks = obj[1];

    scene.add(instancePoints.mesh);

    var axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    var pos = []
    order = []

    // number of squares
    var squares = (width - 1) * (height - 1);
    var points = instancePoints.points;

    for (let i = 0; i < (points.length+0); i++) {

        if ((i+1) < squares+(height-1)) {
            if (((i+1) % width) != 0) {
                pos.push(points[i].position);
                pos.push(points[i+1].position);
                pos.push(points[i + width].position);

                order.push(i);
                order.push(i+1);
                order.push(i + width);

                pos.push(points[i+1].position);
                pos.push(points[i+width].position);
                pos.push(points[i + width + 1].position);

                order.push(i+1);
                order.push(i+width);
                order.push(i + width + 1);
            }
        }
    }

    // console.log(pos);

    shapeGeometry = new THREE.BufferGeometry().setFromPoints(pos);
    var material = new THREE.MeshBasicMaterial({
        color: "blue",
        side: THREE.DoubleSide,
        // wireframe: true,
    });
    shape = new THREE.Mesh(shapeGeometry, material);
    scene.add(shape);

    console.log(shapeGeometry.attributes.position);

}

//

function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

}



//

function initStats() {

    stats = new Stats();
    document.body.appendChild(stats.dom);

}

//

function animate() {

    requestAnimationFrame(animate);

    let delta = clock.getDelta();

    // if less than 5 fps pause animation to stop glitches
    if (delta > 1 / 5) {
        delta = 0;
    }

    instancePoints.updatePoints(delta);
    for (let i = 0; i < 3; i++) {
        sticks.forEach(function (stick) {
            stick.updateStick(delta);
        });
    }


    for (let i = 0; i < order.length; i++) {

        var index = order[i]

        var pos = instancePoints.points[index].position;

        shapeGeometry.attributes.position.setXYZ(i, pos.x, pos.y, pos.z);

    }

    shapeGeometry.attributes.position.needsUpdate = true;

    shapeGeometry.computeVertexNormals();

    stats.update();

    renderer.render(scene, camera);

}

//