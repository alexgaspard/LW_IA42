include("functions");

function selectWeaponType(areaType) { // Devrait être appelée par selectWeapon selon action
	if ((getWeapon() == null) or (getWeaponArea(getWeapon()) != areaType)) {
		var weapons = getWeapons();
		for (var i = 0; i < count(weapons); i++) {
			if (getWeaponArea(weapons[i]) == areaType) {
				setWeapon(weapons[i]);
			}
		}
	}
}

function selectWeapon(action, target) { // Choisir selon action, portée, dégats, etc.
	if (getWeapon() == null) {
		setWeapon(WEAPON_MAGNUM);
	}	
}

function sortReachableEnemies(enemy) {
	if ((getDistanceEnemy(enemy)-getMP()) <= getToolMaxScope(WEAPON_LASER)) {
		return true;
	}
}