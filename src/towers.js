const THREE = require('three');
const QUEUE = require('queue-fifo');

// proto generator that makes tower-pairs

let towerBox = new THREE.BoxBufferGeometry(5, 300, 5);
let towerMat = new THREE.MeshStandardMaterial();
let towerMesh = new THREE.Mesh(towerBox, towerMat);

let towerTopComponent = towerMesh.clone();
towerTopComponent.position.y = 155;
let towerBottomComponent = towerMesh.clone();
towerBottomComponent.position.y = -150;
let tower = new THREE.Object3D();
tower.add(towerTopComponent, towerBottomComponent);

let towerLeft = tower.clone();
towerLeft.position.x = 7;
let towerRight = tower.clone();
towerRight.position.x = -7;

let towerPair = new THREE.Object3D();
towerPair.add(towerLeft, towerRight);

let nextTowerZ = 0;
let Queue = new QUEUE();

// side-effects:
	// adds towers to queue
	// increments towerPos
export function Next () {
	let res = towerPair.clone();
	res.position.z = nextTowerZ;
	
	Queue.enqueue(res);
	nextTowerZ += 14;

	return res;
}

export function Backmost () {
	return Queue.peek();
}

export function RemoveBackmost () {
	Queue.dequeue();
}
