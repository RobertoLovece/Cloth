import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { initInstanceObjects } from './src/instance/InstanceInit.js';

//textures
import Cloth from './src/cloth-texture/fabric_85_basecolor-1K.png';
import ClothRough from './src/cloth-texture/fabric_85_roughness-1K.png';
import ClothAO from './src/cloth-texture/fabric_85_ambientocclusion-1K.png';
import ClothBump from './src/cloth-texture/fabric_85_height-1K.png';
import ClothNormal from './src/cloth-texture/fabric_85_normal-1K.png';
import ClothMetallic from './src/cloth-texture/fabric_85_metallic-1K.png';

require('normalize.css/normalize.css');
require("./src/index.css");

//

const loader = new THREE.TextureLoader();
const cloth = loader.load(Cloth);
const clothRough = loader.load(ClothRough);
const clothAO = loader.load(ClothAO);
const clothBump = loader.load(ClothBump);
const clothNormal = loader.load(ClothNormal);
const clothMetallic = loader.load(ClothMetallic);

//

let renderer, scene, camera, controls;
let container, stats, clock;
let instancePoints, shapeGeometry, shape, sticks;
let dist, order;
let hemiLight, spotLight;
let start = Date.now();

// let color = '#403d39';
let color = '#141414';
let scale = 0.1;
const width = 51;
const height = 51;

//

window.onload = function () {

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

    var camOffset = 2;
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set((width * scale) + camOffset, 2, (height * scale) + camOffset);

    scene = new THREE.Scene();

    cloth.anisotropy = renderer.capabilities.getMaxAnisotropy();

    hemiLight = new THREE.HemisphereLight(0xc4dce5, 0x080820, 4);
    scene.add(hemiLight);

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;

    spotLight = new THREE.SpotLight(0xc4dce5, 4);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize = new THREE.Vector2(1024*4,1024*4);
    scene.add(spotLight)
}

//

function initObjects() {
 
    var obj = initInstanceObjects(width, height);
    instancePoints = obj[0];
    sticks = obj[1];

    var pos = []
    order = []

    // number of squares
    var squares = (width - 1) * (height - 1);
    var points = instancePoints.points;

    for (let i = 0; i < (points.length + 0); i++) {

        if ((i + 1) < squares + (height - 1)) {
            if (((i + 1) % width) != 0) {
                pos.push(points[i].position);
                pos.push(points[i + 1].position);
                pos.push(points[i + width].position);

                order.push(i);
                order.push(i + 1);
                order.push(i + width);

                pos.push(points[i + 1].position);
                pos.push(points[i + width].position);
                pos.push(points[i + width + 1].position);

                order.push(i + 1);
                order.push(i + width);
                order.push(i + width + 1);
            }
        }
    }

    shapeGeometry = new THREE.BufferGeometry().setFromPoints(pos);

    shapeGeometry.computeVertexNormals();
    shapeGeometry.computeBoundingBox();
    
    //

    var base =
        [
            // top left
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,

            // bottom right
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
            
        ];

    var quad_uvs = []

    for (let i = 0 ; i < ((width-1)*(height-1)) ; i++) {
        base.forEach(function (q) {
            quad_uvs.push(q)
        });
    }

    var uvs = new Float32Array( quad_uvs);

    shapeGeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

    //

    var material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,

        color: color,

        roughnessMap: clothRough,
        aoMap: clothAO,
        bumpMap: clothBump,
        normalMap: clothNormal,
        metalnessMap: clothMetallic,

        normalScale: new THREE.Vector2(0.5,0.5),
        bumpScale: 1,
        roughness: 1,

    });


    material.color.anisotropy = 16;

    shape = new THREE.Mesh(shapeGeometry, material);

    shape.castShadow = true;
    shape.receiveShadow = true;

    scene.add(shape);

}

//

function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set( (width * 0.1) / 2, 0, (height * 0.1) / 2 );

    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    controls.update();
}



//

function initStats() {

    // var axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);

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

    shapeGeometry.scale(scale, scale, scale)
    shapeGeometry.computeFaceNormals();
    shapeGeometry.computeVertexNormals();

    spotLight.position.set(
        camera.position.x + 1,
        camera.position.y + 1,
        camera.position.z + 1,
    );

    controls.update();
    stats.update();

    renderer.render(scene, camera);

}

//
// EVENT LISTENERS
//

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onClick, false);

//

function onWindowResize() {
    container = document.getElementById('canvas');

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);
}

//

function onClick(e) {
    instancePoints.gravity = instancePoints.gravity * -1;
}   


