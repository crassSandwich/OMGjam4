import * as CANNON from 'cannon';

export const slipperyMaterial = new CANNON.Material('slipperyMaterial');
export const slipperyContact = new CANNON.ContactMaterial(slipperyMaterial, slipperyMaterial, {
	friction: 0,
	restitution: 0,
	// contactEquationStiffness: 1e8,
	// contactEquationRelaxation: 3
});
