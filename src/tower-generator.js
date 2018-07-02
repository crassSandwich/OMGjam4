import { BoxBufferGeometry, MeshStandardMaterial, Mesh, Object3D, Vector3 } from 'three';
import QUEUE from 'queue-fifo';
import * as CANNON from 'cannon';
import {slipperyMaterial} from './physics-constants.js';

// proto generator that makes tower-pairs

let towerPositions = [
	{x: 7, y: 160, name: 'top left'},
	{x: -7, y: 160, name: 'top right'},
	{x: 7, y: -150, name: 'bottom left'},
	{x: -7, y: -150, name: 'bottom right'}
]
let towerBox = new BoxBufferGeometry(5, 300, 5);
let towerBox_phys = new CANNON.Box(new CANNON.Vec3(2.5, 150, 2.5));
let towerMat = new MeshStandardMaterial();

let towers = new Object3D();
towers.name = 'towers';

let nextTowerZ = 0;
let Queue = new QUEUE();

export default function () {
	this.root = towers;
	
	this.Next = function() {
		let res = new Object3D();
		res.position.setZ(nextTowerZ);
		res.name = 'tower pair'

		res.userData.rigidbody = new CANNON.Body({
			mass: 0,
			material: slipperyMaterial
		});
		res.userData.rigidbody.position.set(0, 0, nextTowerZ);

		for (let i = 0; i < towerPositions.length; i++) {
			let pos = towerPositions[i];

			let mesh = new Mesh(towerBox, towerMat);
			mesh.position.set(pos.x, pos.y, 0);
			mesh.name = pos.name;

			res.userData.rigidbody.addShape(towerBox_phys, new CANNON.Vec3(pos.x, pos.y));

			res.add(mesh);
		}

		Queue.enqueue(res);
		nextTowerZ += 14;

		towers.add(res);

		return res;
	}

	this.Peek = function () {
		let res = Queue.peek();
		return res;
	}
	
	this.Pop = function () {
		let res = Queue.dequeue();
		towers.remove(res);
		return res;
	}

}
