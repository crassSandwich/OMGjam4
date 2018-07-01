import * as THREE from 'three';
import TowerGenerator from './tower-generator';
import Player from './player.js';
import * as CANNON from 'cannon';

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9900);

let world = new CANNON.World();
world.gravity.set(0, 0, -9.82);

let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.5;

scene.fog = new THREE.Fog(scene.background, 30, 137);

let light = new THREE.DirectionalLight();
light.position.y = 5;
let lightTarget = new THREE.Object3D();
lightTarget.position.z = 2;
lightTarget.name = "LightTarget";
scene.add(lightTarget);
light.target = lightTarget;
scene.add(light);

let delta = new THREE.Clock();

let Towers = new TowerGenerator(scene, world);

for (let i = 0; i < 50; i++) {
	Towers.SpawnNext();
}

let PlayerObject = new THREE.Object3D();
PlayerObject.rotation.y = 180 * THREE.Math.DEG2RAD; // face z+
PlayerObject.add(camera);
scene.add(PlayerObject);
let PlayerControls = new Player(PlayerObject, camera, renderer.domElement);

let axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

function mainLoop () {
	let dt = delta.getDelta();
	renderer.render(scene, camera);
	requestAnimationFrame(mainLoop);
	
	if (PlayerObject.position.distanceTo(Towers.Backmost().position) >= 100) {
		Towers.PopBackmost();
		Towers.SpawnNext();
	}
	
	PlayerControls.update(dt);
}

mainLoop();
