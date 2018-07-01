import { BoxBufferGeometry, MeshStandardMaterial, Mesh, Object3D, Vector3 } from 'three';
import QUEUE from 'queue-fifo';
import * as CANNON from 'cannon';

// proto generator that makes tower-pairs

let towerPositions = [
	{x: 7, y: 155, name: 'top left'},
	{x: -7, y: 155, name: 'top right'},
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

export default function (scene, world) {
	scene.add(towers);
	
	this.SpawnNext = function() {
		let res = new Object3D();
		res.position.setZ(nextTowerZ);
		res.name = 'tower pair'

		for (let i = 0; i < towerPositions.length; i++) {
			let pos = towerPositions[i];

			let mesh = new Mesh(towerBox, towerMat);
			mesh.position.set(pos.x, pos.y, 0);
			mesh.name = pos.name;

			mesh.userData.rigidbody = new CANNON.Body({
				mass: 0,
				shape: towerBox_phys,
				position: new CANNON.Vec3(pos.x, pos.y, nextTowerZ)
			});

			world.add(mesh.userData.rigidbody);
			res.add(mesh);
		}

		Queue.enqueue(res);
		nextTowerZ += 14;

		towers.add(res);
	}

	this.Backmost = function () {
		let res = Queue.peek();
		return res;
	}
	
	this.PopBackmost = function () {
		let pair = Queue.dequeue();
		towers.remove(pair);
		for (let i = 0; i < pair.children.length; i++)
			world.remove(pair.children[i].userData.rigidbody);
	}

}
