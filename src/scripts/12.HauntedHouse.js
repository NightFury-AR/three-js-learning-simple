import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import { PlaneBufferGeometry } from 'three';

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const gui = new dat.GUI();

const fog = new THREE.Fog('#262837',1,15);
scene.fog = fog;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');
const bricksAmbientTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');


const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');
const grassAmbientTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');

grassNormalTexture.repeat.set(8,8);
grassColorTexture.repeat.set(8,8);
grassRoughnessTexture.repeat.set(8,8);
grassAmbientTexture.repeat.set(8,8);

grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassAmbientTexture.wrapS = THREE.RepeatWrapping;

grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
grassAmbientTexture.wrapT = THREE.RepeatWrapping;

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
camera.position.x = 0
camera.position.y = 3
camera.position.z = 10
scene.add(camera);

const camHelp = new THREE.CameraHelper(camera);
//scene.add(camHelp);

const axesHelp = new THREE.AxesHelper();
scene.add(axesHelp);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20,20),
    new THREE.MeshStandardMaterial({
        map:grassColorTexture,
        normalMap:grassNormalTexture,
        aoMap:grassAmbientTexture,
        roughnessMap:grassRoughnessTexture
    })
);
ground.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(ground.geometry.attributes.uv.array,2));
ground.rotation.x = - Math.PI * .5;
ground.position.y = 0;
scene.add(ground);

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        normalMap:bricksNormalTexture,
        map:bricksColorTexture,
        roughnessMap:bricksRoughnessTexture,
        aoMap:bricksAmbientTexture
    })
);
walls.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2));
walls.position.y = 1.25;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
);
roof.position.y = 2.5 + .5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,100,100),
    new THREE.MeshStandardMaterial({
        map:doorColorTexture,
        transparent:true,
        alphaMap:doorAlphaTexture,
        aoMap:doorambientOcclusionTexture,
        displacementMap:doorHeightTexture,
        displacementScale:.1,
        normalMap:doorNormalTexture,
        metalnessMap:doorMetalnessTexture,
        roughnessMap:doorRoughnessTexture,
    })
);
door.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2));
door.position.y = 1;
door.position.z = 2 + 0.0001;
scene.add(door);

const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color:'#89c854'});

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial);
const bush2 = new THREE.Mesh(bushGeometry,bushMaterial);
const bush3 = new THREE.Mesh(bushGeometry,bushMaterial);
const bush4 = new THREE.Mesh(bushGeometry,bushMaterial);

bush1.scale.set(.5,.5,.5);
bush2.scale.set(.25,.25,.25);
bush3.scale.set(.4,.4,.4);
bush4.scale.set(.15,.15,.15);

bush1.position.set(.8,.2,2.2);
bush2.position.set(1.4,.1,2.1);
bush3.position.set(-.8,.1,2.2);
bush4.position.set(-1,.05,2.6);

house.add(bush1,bush2,bush3,bush4);

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(.6,.8,.2);
const graveMaterial = new THREE.MeshStandardMaterial({color:'#b2b6b1'});

for(let i=0;i<50;i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry,graveMaterial);
    grave.position.set(x,0.2,z);
    grave.rotation.y = Math.random() * .4;
    grave.rotation.z = Math.random() * .4;
    grave.castShadow = true;
    graves.add(grave);
}


const ambientLight = new THREE.AmbientLight('#b9d5ff',.00012);
gui.add(ambientLight,'intensity').min(0).max(1).step(0.0001);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight('#b9d5ff',.00012);
gui.add(moonLight,'intensity').min(0).max(1).step(0.0001);
gui.add(moonLight.position,'x').min(-5).max(5).step(0.0001);
gui.add(moonLight.position,'y').min(-5).max(5).step(0.0001);
gui.add(moonLight.position,'z').min(-5).max(5).step(0.0001);
scene.add(moonLight);

const doorLight = new THREE.PointLight('#ff7D46',.4,10);
doorLight.position.set(0,2.2,2.7);
house.add(doorLight);


const ghost1 = new THREE.PointLight('#ff00ff',2,3);
const ghost2 = new THREE.PointLight('#00ffff',2,3);
const ghost3 = new THREE.PointLight('#ffff00',2,3);
scene.add(ghost1,ghost2,ghost3);

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
ground.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor('#262837');
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true;

const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime;

    const ghostAngle = elapsedTime * .5;
    ghost1.position.x = Math.cos(ghostAngle) * 4;
    ghost1.position.z = Math.sin(ghostAngle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghostAngle2 = - elapsedTime * .32;
    ghost2.position.x = Math.cos(ghostAngle2) * 5;
    ghost2.position.z = Math.sin(ghostAngle2) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime*2.5);

    const ghostAngle3 = - elapsedTime * .18;
    ghost3.position.x = Math.cos(ghostAngle2) * (7 + Math.sin(elapsedTime * .32));
    ghost3.position.z = Math.sin(ghostAngle2) * (7 + Math.sin(elapsedTime * .5));
    ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime*2);

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()