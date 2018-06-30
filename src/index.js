const THREE = require('three');
import * as Towers from './towers.js';

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9900);

let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.y = 180 * THREE.Math.DEG2RAD; // face z+
camera.position.y = 1.5;
scene.add(camera);

scene.fog = new THREE.Fog(scene.background, 30, 137);

let light = new THREE.DirectionalLight();
light.position.y = 5;
let lightTarget = new THREE.Object3D();
lightTarget.position.z = 2;
scene.add(lightTarget);
light.target = lightTarget;
scene.add(light);

let delta = new THREE.Clock();

for (let i = 0; i < 50; i++) {
	Towers.Spawn(scene);
}

function mainLoop () {
	let dt = delta.getDelta();
	renderer.render(scene, camera);
	requestAnimationFrame(mainLoop);

	if (camera.position.distanceTo(Towers.Queue.peek().position) >= 100) {
		Towers.Queue.dequeue();
		Towers.Spawn(scene);
	}

	camera.position.z += 100 * dt;
	camera.rotation.x += dt;
}

mainLoop();
