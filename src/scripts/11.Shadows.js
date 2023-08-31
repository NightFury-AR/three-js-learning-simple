import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();
const gui = new dat.GUI();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

const txtLoader = new THREE.TextureLoader();
const sShadow = txtLoader.load('/textures/simpleShadow.jpg');

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const material = new THREE.MeshStandardMaterial();
material.roughness = .4;
material.metalness = .4;

// 1. enable shadow map on renderer
// 2. cast shadow
// 3. receive shadow 
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1,16,16),
    material
);

sphere.castShadow = true;
scene.add(sphere);

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10,10),
    material
);
plane.receiveShadow = true;
plane.rotation.x = - Math.PI * 0.5;
plane.position.y = -1.5;
scene.add(plane);


const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(4,4),
    new THREE.MeshBasicMaterial({
        color:0x000000,
        transparent:true,
        alphaMap:sShadow,
    })
);
sphereShadow.rotation.x = - Math.PI * .5;
sphereShadow.position.y = plane.position.y + 0.01;
//sphereShadow.material.alphaMap = txtLoader;
scene.add(sphereShadow);


const ambientLight =  new THREE.AmbientLight(0xffffff,1);
scene.add(ambientLight);

/* const directionalLight = new THREE.DirectionalLight(0xCe00ff,.7);
directionalLight.position.x = 3;
directionalLight.position.y = 2;
directionalLight.position.z = 3;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 1 ;
directionalLight.shadow.camera.right = 1 ;
directionalLight.shadow.camera.bottom = -1 ;
directionalLight.shadow.camera.left = -1 ;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 12;
directionalLight.shadow.radius = 10;
scene.add(directionalLight);

const dLShadowCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLShadowCamHelper);
gui.add(directionalLight.position,'x').min(-(Math.PI*2)).max(Math.PI*2).step(0.0001);
gui.add(directionalLight.position,'y').min(.5).max(12).step(0.0001);
gui.add(directionalLight.position,'z').min(.5).max(12).step(0.0001);
gui.add(directionalLight,'intensity').min(.5).max(12).step(0.0001);

const spotLight = new THREE.SpotLight(0xffccff,.4,10,Math.PI*.3);
spotLight.position.set(0,2,2);
spotLight.castShadow = true;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 12;
spotLight.shadow.camera.fov = 30;
scene.add(spotLight);
scene.add(spotLight.target);

const sLShadowCamHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(sLShadowCamHelper); 

gui.add(spotLight.position,'x').min(-(Math.PI*2)).max(Math.PI*2).step(0.0001);
gui.add(spotLight.position,'y').min(.5).max(12).step(0.0001);
gui.add(spotLight.position,'z').min(.5).max(12).step(0.0001);
gui.add(spotLight,'intensity').min(.5).max(12).step(0.0001);
 */
const pointLight = new THREE.PointLight(0xffffff,.3);
pointLight.castShadow = true;
pointLight.position.set(-1,1,4);
pointLight.shadow.camera.near = .1;
pointLight.shadow.camera.far = 6;
scene.add(pointLight);

/* const pLCamHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pLCamHelper); */

gui.add(pointLight.position,'x').min(-(Math.PI*2)).max(Math.PI*2).step(0.0001);
gui.add(pointLight.position,'y').min(.5).max(12).step(0.0001);
gui.add(pointLight.position,'z').min(.5).max(12).step(0.0001);
gui.add(pointLight,'intensity').min(.5).max(12).step(0.0001);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
// 1. enable shadow map
//renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime
    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime*5));
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1-sphere.position.y) * .3;
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()