import { BoxBufferGeometry, MeshStandardMaterial, Mesh, Object3D } from 'three';
import QUEUE from 'queue-fifo';

// proto generator that makes tower-pairs

let towerBox = new BoxBufferGeometry(5, 300, 5);
let towerMat = new MeshStandardMaterial();
let towerMesh = new Mesh(towerBox, towerMat);

let towerTopComponent = towerMesh.clone();
towerTopComponent.position.y = 155;
towerTopComponent.name = "Top";
let towerBottomComponent = towerMesh.clone();
towerBottomComponent.position.y = -150;
towerBottomComponent.name = "Bottom";
let tower = new Object3D();
tower.add(towerTopComponent, towerBottomComponent);

let towerLeft = tower.clone();
towerLeft.position.x = 7;
towerLeft.name = "Left";
let towerRight = tower.clone();
towerRight.position.x = -7;
towerRight.name = "Right";

let towerPair = new Object3D();
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

export function PopBackmost () {
	return Queue.dequeue();
}
