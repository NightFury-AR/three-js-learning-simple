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
});

const loadingManager = new THREE.LoadingManager
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load('/textures/checkerboard-8x8.png');
/* texture.repeat.x = 2;
texture.repeat.y = 1;
texture.wrapS = THREE.RepeatWrapping;  */
//texture.offset.x = 0.5;
//texture.rotation = Math.PI / 4;
//texture.center.x = .5;
//texture.center.y=.5;

texture.generateMipmaps = false;
texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter;

//scene
const scene = new THREE.Scene();

//mesh
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(.5,.5,.5),
    new THREE.MeshBasicMaterial({map:texture})
);
scene.add(mesh);

//camera
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

const clock = new THREE.Clock(); 

function animateSomething() {
    /* const elapsedTime = clock.getElapsedTime();
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    camera.position.y = - (cursor.y * 5);
    camera.lookAt(mesh.position); */
    //mesh.rotation.y +=0.05;   
    controls.update();
    renderer.render(scene,camera);
    window.requestAnimationFrame(animateSomething);
}
animateSomething();