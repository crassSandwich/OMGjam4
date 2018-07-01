import * as THREE from 'three';
import TowerGenerator from './tower-generator';
import Player from './player.js';
import * as CANNON from 'cannon';
import {slipperyContact} from './physics-constants.js';

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9900);

let world = new CANNON.World();
world.gravity.set(0, -90, 0);
world.addContactMaterial(slipperyContact);

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

let player = new Player(renderer.domElement, scene, world);

let axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

function mainLoop () {
	let dt = delta.getDelta();
	world.step(dt);
	
	if (player.root.position.z - Towers.Backmost().position.z >= 100) {
		Towers.PopBackmost();
		Towers.SpawnNext();
	}
	
	player.update(dt);

	renderer.render(scene, player.camera);
	requestAnimationFrame(mainLoop);
}

mainLoop();
