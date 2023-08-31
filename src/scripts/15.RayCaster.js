import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

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
camera.position.z = 5;
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const sp1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5,16,16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
sp1.position.x = -2;
const sp2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5,16,16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const sp3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5,16,16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
sp3.position.x = 2;
scene.add(sp1,sp2,sp3);

const raycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3(-3,0,0);
const rayDirection = new THREE.Vector3(10,0,0);
rayDirection.normalize();
raycaster.set(rayOrigin,raycaster);

//const intersectObject = raycaster.intersectObject(sp1);
//const intersectObjects = raycaster.intersectObjects(sp1,sp2,sp3);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const mouse = new THREE.Vector3();

window.addEventListener('mousemove',(event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 +1;
});

window.addEventListener('click',() => {
    if(currentIntersect) {
        switch(currentIntersect.object)
        {
            case sp1:
                console.log('clicked sp 1');
                break;
            case sp2:
                console.log('clicked sp 2');
                break;
            case sp3:
                console.log('clicked sp 3');
                break;
        }
    }
})

const clock = new THREE.Clock()
let lastElapsedTime = 0

let currentIntersect = null;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    sp1.position.y = Math.sin(elapsedTime*.3)*1.5;
    sp2.position.y = Math.sin(elapsedTime*.8)*1.5;
    sp3.position.y = Math.sin(elapsedTime*1.4)*1.5;
    lastElapsedTime = elapsedTime;
    raycaster.setFromCamera(mouse,camera);
    const objToTest = [sp1,sp2,sp3];
    const intersects = raycaster.intersectObjects(objToTest);
    for(const obj of objToTest) { obj.material.color.set('#ff0000');}
    for(const intersect of intersects){ intersect.object.material.color.set('#0000ff');} 

    /* const rayOrigin = new THREE.Vector3(-3,0,0);
    const rayDirection = new THREE.Vector3(1,0,0);
    rayDirection.normalize();
    raycaster.set(rayOrigin,rayDirection);
    const objToTest = [sp1,sp2,sp3];
    const intersects = raycaster.intersectObjects(objToTest);
    for(const obj of objToTest) { obj.material.color.set('#ff0000');}
    for(const intersect of intersects){ intersect.object.material.color.set('#0000ff');} 
    */
   if(intersects.length) {
       if(currentIntersect === null) {
         console.log('mouse entered');
       }
       currentIntersect = intersects[0];
   }
   else {
       if(currentIntersect){
        console.log('mouse leave');
       }
       currentIntersect = null;
       
   }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()