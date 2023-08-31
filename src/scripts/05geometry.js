import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = { width:window.innerWidth , height:window.innerHeight }
const cursor = {x:0,y:0}

window.addEventListener('resize',() => {
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
});

window.addEventListener('mousemove',event => {
    cursor.x=(event.clientX / sizes.width)-.5;
    cursor.y= (event.clientY / sizes.height)-.5;
});

window.addEventListener('dblclick',(event) => {
    const fElem = document.fullscreenElement || document.webkitfullscreenElement;
    if(!document.fullscreenElement) {
        if(canvas.requestFullscreen){
            canvas.requestFullscreen();
        }
        else if(canvas.webkitfullscreenElement) {
            canvas.webkitfullscreenElement
        }
    }else {
        document.exitFullscreen();
    }
})

const scene = new THREE.Scene();

//const geometry = new THREE.BoxGeometry(.5,.5,.5);

//custom geometry with geometry vertices + faces (geometry disabled for newer version)
const count = 50;
const positionArray = new Float32Array(count*3*3);
for (let index = 0; index < count * 3 * 3; index++) {
    positionArray[index] = (Math.random() - .5)
}
const positionArrtribute = new THREE.BufferAttribute(positionArray,3);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position',positionArrtribute);

/* geometry.
customGeo.vertices.push(new THREE.Vector3(0,0,0));
customGeo.vertices.push(new THREE.Vector3(0,1,0));
customGeo.vertices.push(new THREE.Vector3(0,0,1));
const face = new THREE.Face3(0,1,2);
geometry.faces.push(face); */

const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true})
);
scene.add(mesh);


const axisHelper = new THREE.AxesHelper();
scene.add(axisHelper);

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height,.1,100);
camera.position.z = 1;
scene.add(camera);

const canvas = document.querySelector('canvas.webgl');

const controls = new OrbitControls(camera,canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGL1Renderer({
    canvas:canvas,
});

renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);

function animateSomething() {
    controls.update();
    renderer.render(scene,camera);
    window.requestAnimationFrame(animateSomething);
}
animateSomething();