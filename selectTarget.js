include("selectWeapon");

function selectTarget(action) { // Choisir entre allié (ex soin) ou ennemi
	// On récupère l'ennemi le plus proche
	var target;
	var enemies = getAliveEnemies();
	enemies = arrayFilter(enemies, sortReachableEnemies);
	target = selectEnemiesOnSameLine(enemies);
	if (target == null) {
		selectWeaponType(AREA_POINT);
		if ((getAlliesCount()>1) and ((getDistanceEnemy(getNearestEnemy())-getMP()) > getToolMaxScope(getWeapon()))) {
			target = getLowestLifeEnemy();
			debug(getName(target)+" has lowest life");
		} else {
			target = getNearestEnemy();
		}
	} else {
		selectWeaponType(AREA_LASER_LINE);
	}
	if (!isAlive(target)) {
		target = getNearestEnemy();
	}
	return target;
}

function getLowestLifeEnemy() {
	var arrayEnemies = getAliveEnemies();
	arraySort(arrayEnemies, sortLowestLifeEnemy);
	return arrayEnemies[0];
	
}

function sortLowestLifeEnemy(value1, value2) {
	if (getLife(value1) < getLife(value2)) {
		return -1;
	} else {
		return 1;
	}
}

function selectEnemiesOnSameLine(enemies) {
	var cellX = 0, cellY = 0;
	var target;
	for (var i = 0; i < count(enemies); i++) {
		for (var j = 0; j < count(enemies); j++) {
			if (isOnSameLine(getCell(enemies[i]), getCell(enemies[j]))) {
				if (getCellX(getCell(enemies[i])) == getCellX(getCell(enemies[j]))) {
					cellX = getCellX(getCell(enemies[i]));
				} else {
					cellY = getCellY(getCell(enemies[i]));
				}
			}
		}
	}
	if (cellX > 0) {
		var cell = getCellFromXY(cellX, getCellY(getCell()));
		moveTowardCell(cell);
		target = getNearestEnemyToCell(cell);
	} else if (cellY > 0) {
		var cell = getCellFromXY(getCellY(getCell()), cellY);
		moveTowardCell(cell);
		target = getNearestEnemyToCell(cell);
	}
}

function sortReachableEnemies(enemy) {
	if ((getDistanceEnemy(enemy)-getMP()) <= getToolMaxScope(WEAPON_LASER)) {
		return true;
	}
}