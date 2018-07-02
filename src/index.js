import * as THREE from 'three';
import TowerGenerator from './tower-generator';
import Player from './player.js';
import * as CANNON from 'cannon';
import {slipperyContact} from './physics-constants.js';

//#region init
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9900);

let world = new CANNON.World();
world.gravity.set(0, -90, 0);
world.addContactMaterial(slipperyContact);

// set this low enough that unfocusing the window doesn't glitch the simulation (due to long dt), but high enough that stutters aren't noticable
// TODO: can this be more sophisticated?
let maxPhysTime = .03;

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
	spawnTowers();
}

let player = new Player(renderer.domElement);
scene.add(player.root);
world.addBody(player.rigidbody);

let axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
//#endregion

function spawnTowers () {
	let towerPair = Towers.Next();
	scene.add(towerPair);
	world.add(towerPair.userData.rigidbody);
}

function despawnTowers () {
	let towerPair = Towers.Pop();
	scene.remove(towerPair);
	world.remove(towerPair.userData.rigidbody);
}

(function mainLoop () {

	let dt = delta.getDelta();
	world.step(Math.min(dt, maxPhysTime));
	
	if (player.root.position.z - Towers.Peek().position.z >= 100) {
		despawnTowers();
	}
	
	player.update(dt);

	renderer.render(scene, player.camera);
	requestAnimationFrame(mainLoop);

})();
