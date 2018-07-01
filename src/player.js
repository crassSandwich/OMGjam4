// import { Camera, Object3D } from 'three';

export default function (body, camera, domElement) {
	
	let self = this;
	
	//#region fields
	self.body = body;
	self.camera = camera;

	self.debug = false;

	self.domElement = domElement;

	self.enabled = true;

	self.movementSpeed = 1.0;
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
	
	self.domElement.setAttribute('tabindex', - 1);
	
	//#region methods
	self.update = function (delta) {
		if (self.enabled === false) return;

		let actualMoveSpeed = delta * self.movementSpeed;

		if (self.moveForward) self.body.translateZ(- actualMoveSpeed);
		if (self.moveBackward) self.body.translateZ(actualMoveSpeed);

		if (self.moveLeft) self.body.translateX(- actualMoveSpeed);
		if (self.moveRight) self.body.translateX(actualMoveSpeed);

		let actualLookSpeed = delta * self.lookSpeed;

		self.body.rotateY(- self.mouseX * actualLookSpeed);
		self.camera.rotateX(- self.mouseY * actualLookSpeed);
		
		self.mouseX = 0;
		self.mouseY = 0;
		
		if (self.constrainVertical) {
			self.camera.rotation.x = Math.min(Math.max(self.camera.rotation.x, self.verticalMin), self.verticalMax);
		}
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

		self.mouseX += event.movementX;
		self.mouseY += event.movementY;

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
