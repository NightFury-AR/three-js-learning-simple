import * as THREE from 'three';


const sizes = { width:window.innerWidth,height:window.innerHeight };

const scene = new THREE.Scene();

const geometry =  new THREE.BoxGeometry(.1,.1,.1);
const material = new THREE.MeshBasicMaterial({color:0x00ff00});
const mesh =  new THREE.Mesh(geometry,material);

//(position,scale,rotate,quaternion)
mesh.scale.set(10,10,10);
mesh.position.set(1,1,1);
mesh.rotation.reorder('YXZ');
mesh.rotation.x=Math.PI;

const camera = new THREE.PerspectiveCamera(90,sizes.width / sizes.height);
camera.position.z = 5;
camera.lookAt(mesh.position);
scene.add(mesh);
scene.add(camera);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);



const canvas  = document.querySelector('.trans');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
});
renderer.setSize(sizes.width,sizes.height);

//running
renderer.render(scene,camera);