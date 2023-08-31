import * as THREE from 'three'
import { MeshMatcapMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

/*  font loader */
const fontLoader = new THREE.FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextGeometry(
            'Hello World',
            {
                font:font,
                size:.5,
                height:.2,
                curveSegments:4,
                bevelEnable:true,
                bevelThickness:.03,
                bevelSize:.02,
                bevelOffset:0,
                bevelSegments:3,
            }
        )
        /* textGeometry.computeBoundingBox();
        textGeometry.translate(
            -textGeometry.boundingBox.max.x * .5,
            -textGeometry.boundingBox.max.y * .5,
            -textGeometry.boundingBox.max.z * .5,
        ) */

        textGeometry.center();
        const material = new THREE.MeshMatcapMaterial({matcap:matcapTexture});
        const text = new THREE.Mesh(textGeometry,material);
        scene.add(text);

        const donutGeometry = new THREE.TorusBufferGeometry(.3,.2,20,45);
        const boxGeometry = new THREE.BoxBufferGeometry(.5,.5,.5);
        const sphereGeometry = new THREE.SphereBufferGeometry(.3,16,16);

        for (let index = 0; index < 100; index++) {
            const donut = new THREE.Mesh(donutGeometry,material);
            const cube = new THREE.Mesh(boxGeometry,material);
            const sphere = new THREE.Mesh(sphereGeometry,material);

            donut.position.x = (Math.random() - .5) * 10;
            donut.position.y = (Math.random() - .5) * 10;
            donut.position.z = (Math.random() - .5) * 10;
            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;
            const scale = Math.random();
            donut.scale.set(scale,scale,scale);

            cube.position.x = (Math.random() - .5) * 11 ;
            cube.position.y = (Math.random() - .5) * 11;
            cube.position.z = (Math.random() - .5) * 11;
            cube.rotation.x = Math.random() * Math.PI;
            cube.rotation.y = Math.random() * Math.PI;
            cube.scale.set(scale,scale,scale);

            sphere.position.x = (Math.random() - .5) * 12 ;
            sphere.position.y = (Math.random() - .5) * 12;
            sphere.position.z = (Math.random() - .5) * 12;
            sphere.rotation.x = Math.random() * Math.PI;
            sphere.rotation.y = Math.random() * Math.PI;
            sphere.scale.set(scale,scale,scale);

            scene.add(donut);
            scene.add(cube);
            scene.add(sphere);
        }
    }
       
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Cube
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)
*/

/**
 * Renderer
 */
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
    // Update controls
    controls.update()
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()