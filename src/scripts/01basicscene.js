import * as THREE from 'three';

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

//scene + camera + material
const scene = new THREE.Scene();

//mesh (material , geometry)
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(cube);

//camera perspective camera
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,100);
camera.position.z = 4;
scene.add(camera);

const canvas = document.querySelector('canvas.webgl');

//renderer
const renderer = new THREE.WebGL1Renderer({
    canvas:canvas,
})

renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);