import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {width:window.innerWidth,height:window.innerHeight};
const gui = new dat.GUI();

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,100);
camera.position.z = 5;
scene.add(camera);

const controlParameters = {};
controlParameters.count = 1000;
controlParameters.size =.02;
controlParameters.radius = 5;
controlParameters.branches =3;
controlParameters.spin = 1;
controlParameters.randomness = .2;
controlParameters.randomnessPower = 3;
controlParameters.insideColor = '#ff6030';
controlParameters.outsideColor = '#1b3984';

let material=null;
let geometry=null;
let points=null;

const generateGalaxy = () => {
    if(points!==null){
        material.dispose();
        geometry.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(controlParameters.count*3);
    const colors = new Float32Array(controlParameters.count*3);

    const colorInside = new THREE.Color(controlParameters.insideColor);
    const colorOutside = new THREE.Color(controlParameters.outsideColor);

    for (let i = 0; i < controlParameters.count; i++) {
        let i3 = i * 3;
        const radius = Math.random() * controlParameters.radius;
        const spinAngle = radius * controlParameters.spin;
        const branchAngle = (i % controlParameters.branches) / controlParameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(),controlParameters.randomnessPower) * (Math.random() < .5 ? 1 : -1);
        const randomY = Math.pow(Math.random(),controlParameters.randomnessPower) * (Math.random() < .5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(),controlParameters.randomnessPower) * (Math.random() < .5 ? 1 : -1);

        positions[i3+0] = Math.cos(branchAngle + spinAngle)*radius + randomX;
        positions[i3+1] = randomY;
        positions[i3+2] = Math.sin(branchAngle + spinAngle)*radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside,radius/controlParameters.radius)
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));

    material = new THREE.PointsMaterial({
        size:controlParameters.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        vertexColors:true,
    });

    points = new THREE.Points(geometry,material);
    scene.add(points);
}


gui.add(controlParameters,'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy);
gui.add(controlParameters,'size').min(0.0001).max(0.1).step(0.000001).onFinishChange(generateGalaxy);
gui.add(controlParameters,'radius').min(.01).max(20).step(.01).onFinishChange(generateGalaxy);
gui.add(controlParameters,'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(controlParameters,'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(controlParameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(controlParameters,'randomnessPower').min(0).max(9).step(0.001).onFinishChange(generateGalaxy);

generateGalaxy();



const canvas = document.querySelector('canvas.webgl');


const controls = new OrbitControls(camera,canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
    antialias:true,
});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock();

function animateSomething() {
    controls.update();
    renderer.render(scene,camera);
    window.requestAnimationFrame(animateSomething);
}

animateSomething();