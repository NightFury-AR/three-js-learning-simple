import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {height:window.innerHeight,width:window.innerWidth};


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,100);
camera.position.z = 2;
scene.add(camera);

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/2.png');

const geometry = new THREE.BufferGeometry();
const count = 1000;
const positions = new Float32Array(count*3);
const colors = new Float32Array(count*3);
for (let index = 0; index < (count*3); index++) {
    positions[index] = (Math.random() - .5) * 10;
    colors[index] = Math.random()
}
geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));

const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial()
);

particles.material.size = .2;
particles.material.sizeAttenuation = true;
//particles.material.color = new THREE.Color('#ff88cc');
particles.material.transparent = true;
particles.material.alphaMap = particleTexture;
//particles.material.alphaTest = 0.001;
//particles.material.depthTest = false;
particles.material.depthWrite = false;
particles.material.blending = THREE.AdditiveBlending;

particles.material.vertexColors = true;

scene.add(particles);

console.log(particleTexture);

const canvas = document.querySelector('canvas.webgl');


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime


    //particles.rotation.y = -elapsedTime * .2;
    for (let i=0;i < count; i++){
        const i3 = i*3;
        const x = particles.geometry.attributes.position.array[i3];
        particles.geometry.attributes.position.array[i3+1] = Math.sin(elapsedTime+x);
    }
    particles.geometry.attributes.position.needsUpdate = true;

    
    // Update controls
    controls.update();
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()