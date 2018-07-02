import { Vector3, Math as THREEMath, PerspectiveCamera, Object3D } from 'three';
import * as CANNON from 'cannon';
import {slipperyMaterial} from './physics-constants.js';

export default function (domElement) {
	
	let self = this;
	
	//#region fields
	self.root = new Object3D();
	self.root.name = 'player';
	self.root.position.set(-7, 5, 0);
	self.root.rotation.y = 180 * THREEMath.DEG2RAD; // face z+

	self.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
	self.camera.position.setY(1.5);
	self.root.add(self.camera);

	self.rigidbody = new CANNON.Body({
		mass: 80,
		shape: new CANNON.Sphere(.8), // note that the player is basically a hamster
		position: new CANNON.Vec3().copy(self.root.position),
		quaternion: new CANNON.Quaternion().copy(self.root.quaternion),
		linearDamping: .997,
		material: slipperyMaterial
	});

	self.debug = false;

	self.domElement = domElement;
	self.domElement.setAttribute('tabindex', - 1);

	self.enabled = true;

	self.movementForce = 2000;
	self.topSpeed2 = 400;
	self.lookSpeed = .1;
	
	self.constrainVertical = true;
	self.verticalMin = -Math.PI / 2;
	self.verticalMax = Math.PI / 2;
	
	self.mouseX = 0;
	self.mouseY = 0;
	
	self.moveForward = false;
	self.moveBackward = false;
	self.moveLeft = false;
	self.moveRight = false;
	//#endregion
	
	//#region methods
	self.update = function (delta) {
		if (self.enabled === false) return;
		
		if (self.rigidbody.velocity.lengthSquared() < self.topSpeed2) {
			let actualMoveSpeed = delta * self.movementForce;
			let zForce = 0, xForce = 0;

			if (self.moveForward) zForce = -actualMoveSpeed;
			if (self.moveBackward) zForce = actualMoveSpeed;
			
			if (self.moveLeft) xForce = -actualMoveSpeed;
			if (self.moveRight) xForce = actualMoveSpeed;

			let impulse = new CANNON.Vec3().copy(new Vector3(xForce, 0, zForce).applyQuaternion(self.root.quaternion));

			self.rigidbody.applyImpulse(impulse, CANNON.Vec3.ZERO);
		}
		
		let actualLookSpeed = delta * self.lookSpeed;
		
		self.root.rotateY(- self.mouseX * actualLookSpeed);
		self.camera.rotateX(- self.mouseY * actualLookSpeed);
		
		self.mouseX = 0;
		self.mouseY = 0;
		
		if (self.constrainVertical) {
			self.camera.rotation.x = Math.min(Math.max(self.camera.rotation.x, self.verticalMin), self.verticalMax);
		}
		
		self.root.position.copy(self.rigidbody.position);
	};
	//#endregion
	
	//#region controls
	function onMouseDown (event) {
		if (self.debug) console.log('player mouse down');

		self.domElement.focus();
		self.domElement.requestPointerLock = self.domElement.requestPointerLock || self.domElement.mozRequestPointerLock || self.domElement.webkitRequestPointerLock;
		self.domElement.requestPointerLock();

		event.preventDefault();
		event.stopPropagation();
	};

	function onMouseUp (event) {
		if (self.debug) console.log('player mouse up');

		event.preventDefault();
		event.stopPropagation();
	};

	function onMouseMove (event) {
		if (self.debug) console.log('player mouse move');

		// TODO: better cross-browser support here
		self.mouseX = event.movementX;
		self.mouseY = event.movementY;

		event.preventDefault();
		event.stopPropagation();
	};

	function onKeyDown (event) {
		if (self.debug) console.log('player key down');

		switch (event.keyCode) {
			case 38: /*up*/
			case 87: /*W*/ self.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ self.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ self.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ self.moveRight = true; break;
		}

		event.preventDefault();
		event.stopPropagation();
	};

	function onKeyUp (event) {
		if (self.debug) console.log('player key up');

		switch (event.keyCode) {
			case 38: /*up*/
			case 87: /*W*/ self.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ self.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ self.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ self.moveRight = false; break;
		}

		event.preventDefault();
		event.stopPropagation();
	};

	function contextmenu(event) {
		if (self.debug) console.log('player context menu');

		event.preventDefault();
	}

	self.dispose = function () {
		self.domElement.removeEventListener('contextmenu', contextmenu, false);
		self.domElement.removeEventListener('mousedown', onMouseDown, false);
		self.domElement.removeEventListener('mousemove', onMouseMove, false);
		self.domElement.removeEventListener('mouseup', onMouseUp, false);

		window.removeEventListener('keydown', onKeyDown, false);
		window.removeEventListener('keyup', onKeyUp, false);
	};

	self.domElement.addEventListener('contextmenu', contextmenu, false);
	self.domElement.addEventListener('mousemove', onMouseMove, false);
	self.domElement.addEventListener('mousedown', onMouseDown, false);
	self.domElement.addEventListener('mouseup', onMouseUp, false);

	window.addEventListener('keydown', onKeyDown, false);
	window.addEventListener('keyup', onKeyUp, false);
	//#endregion

};
