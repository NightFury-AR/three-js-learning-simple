import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const sizes = { width:window.innerWidth ,height:window.innerHeight};
const cursor = {x:0,y:0}
const gui = new dat.GUI;

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
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height,0.1,1000);
scene.add(camera);
camera.position.z = 4;

const axisHelper = new THREE.AxesHelper();
scene.add(axisHelper);

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const metCapTexture = textureLoader.load('/textures/matcaps/8.png');
const gradientsTexture = textureLoader.load('/textures/gradients/3.jpg');

//const material = new THREE.MeshBasicMaterial({color:0xff0000});
//material.map = doorAlphaTexture;
//material.color = new THREE.Color(0x00ff00);
//material.wireframe = true;
//material.transparent = true;
//material.opacity = .5;
//material.alphaMap = doorAlphaTexture;
//material.side = THREE.DoubleSide;

//const material = new THREE.MeshNormalMaterial();
//material.flatShading = true;

//const material = new THREE.MeshMatcapMaterial();
//material.matcap = metCapTexture;

//const material = new THREE.MeshDepthMaterial();

//const material = new THREE.MeshLambertMaterial();

//const material = new THREE.MeshPhongMaterial();
//material.shininess = 100;
//material.specular = new THREE.Color(0x1188ff);

//const material = new THREE.MeshToonMaterial();
//gradientsTexture.minFilter = THREE.NearestFilter
//gradientsTexture.magFilter = THREE.NearestFilter
//gradientsTexture.generateMipmaps = false;
//material.gradientMap = gradientsTexture;

const material = new THREE.MeshStandardMaterial();
material.envMap = environmentMap;
material.metalness = 0;
material.roughness = 1;
/* material.map = doorColorTexture;
material.aoMap = doorambientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture;
material.displacementScale = .05;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.transparent = true;
material.alphaMap = doorAlphaTexture;
 */
gui.add(material,'metalness').min(0).max(1).step(0.0001);
gui.add(material,'roughness').min(0).max(1).step(0.0001);
gui.add(material,'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material,'displacementScale').min(0).max(10).step(0.0001);


const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5,16,16),
    material
)
sphere.geometry.setAttribute('uv2',new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2));
sphere.position.x = 1.5;
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1),
    material
)
plane.geometry.setAttribute('uv2',new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2));
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(.3,.2,16,32),
    material
)
torus.geometry.setAttribute('uv2',new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2));
torus.position.x = -1.5;
scene.add(sphere,plane,torus);

const ambientLight = new THREE.AmbientLight(0xffffff,.5)
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff,.5)
pointLight.position.x = 2;
pointLight.position.y= 3;
pointLight.position.z = 4;
scene.add(pointLight);

const canvas = document.querySelector('canvas.webgl');
const controls = new OrbitControls(camera,canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas:canvas
});
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);

const clock = new THREE.Clock(); 

function animateSomething() {
    sphere.rotation.x = .1 * clock.getElapsedTime();
    plane.rotation.x = .1 * clock.getElapsedTime();
    torus.rotation.x = .1 * clock.getElapsedTime();
    sphere.rotation.y = .15 * clock.getElapsedTime();
    plane.rotation.y = .15 * clock.getElapsedTime();
    torus.rotation.y = .15 * clock.getElapsedTime();
    controls.update();
    renderer.render(scene,camera);
    window.requestAnimationFrame(animateSomething);
}
animateSomething();