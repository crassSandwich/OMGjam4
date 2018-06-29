const THREE = require('three');

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);

let clock = new THREE.Clock();

function mainLoop () {
	let dt = clock.getDelta();
	renderer.render(scene, camera);
	requestAnimationFrame(mainLoop);
}

mainLoop();
