import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper';

import * as dat from 'dat.gui';

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();

const gui = new dat.GUI;

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const textureLoader = new THREE.TextureLoader();

const sizes = { width: window.innerWidth, height: window.innerHeight }

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
camera.position.z = 4
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

const material = new THREE.MeshStandardMaterial();
material.roughness = .4;
material.metalness = .3;

const cube = new THREE.Mesh( new THREE.BoxBufferGeometry(1, 1, 1), material);
const sphere = new THREE.Mesh( new THREE.SphereBufferGeometry(.5,16,16), material);
const torus = new THREE.Mesh( new THREE.TorusBufferGeometry(.3,.2,20,45), material);
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(7,7),material);

//creating surface
plane.rotation.x = - Math.PI * .5;
plane.position.y = -1.5;
sphere.position.x = -1.5;
torus.position.x = 1.5;
scene.add(cube,sphere,torus,plane);

//lights 

//constant lights from all directions
const ambientLight = new THREE.AmbientLight(0xffffff,.5);
scene.add(ambientLight);

//from only one direction
const directionalLight =  new THREE.DirectionalLight(0x00fffc,.5);
directionalLight.position.set(1,1,1);
scene.add(directionalLight);

//sky color + groundcolor
const hemisphere = new THREE.HemisphereLight(0x0000ff,0x00ff00,.4);
scene.add(hemisphere);

const pointLight = new THREE.PointLight(0xffffff,0.5);
pointLight.position.x =  4;
pointLight.position.y = 1;
scene.add(pointLight);  

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,10,2,2);
rectAreaLight.position.set(-1.5,0,1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(0x4cff00,2,5,2,1,10);
scene.add(spotLight);

//light helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,.2,0x3eff00);
scene.add(directionalLightHelper);

const hemiSphereLightHelper = new THREE.HemisphereLightHelper(hemisphere,.3,0x3e00ff);
scene.add(hemiSphereLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight,.3,0x3eff00);
scene.add(pointLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight,0x3eff00);
scene.add(rectAreaLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight,.3,0x3eff00);
scene.add(spotLightHelper);

//gui control


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    sphere.rotation.z +=.01
    cube.rotation.z +=.01
    torus.rotation.z +=.01
    lastElapsedTime = elapsedTime
    controls.update()
    rectAreaLightHelper.position.copy(rectAreaLight.position);
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
    spotLightHelper.position.copy(spotLight.position);
    spotLightHelper.quaternion.copy(spotLight.quaternion);
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()