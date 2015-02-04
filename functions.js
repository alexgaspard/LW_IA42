

function getDistanceEnemy(enemy) {
	if (enemy == null) {return 0;}
	if (getCell(enemy) == null) {return 0;}
	var me_x = getCellX(getCell());
	var me_y = getCellY(getCell());
	var enemy_x = getCellX(getCell(enemy));
	var enemy_y = getCellY(getCell(enemy));
	var distance_enemy = abs(enemy_x-me_x)+abs(enemy_y-me_y);
	return distance_enemy;
}

function getDistanceBetween(value1, value2) {	
	if ((value1 == null) or (value2 == null)) {return 0;}
	if ((getCell(value1) == null) or (getCell(value2) == null)) {return 0;}
	var value1_x = getCellX(getCell(value1));
	var value1_y = getCellY(getCell(value1));
	var value2_x = getCellX(getCell(value2));
	var value2_y = getCellY(getCell(value2));
	var distance = abs(value2_x-value1_x)+abs(value2_y-value1_y);
	return distance;
}

function getToolMaxScope(tool) {
	if (isWeapon(tool)) {
		return getWeaponMaxScope(tool);
	} else if (isChip(tool)) {
		return getChipMaxScope(tool);
	}
}

function getToolMinScope(tool) {
	if (isWeapon(tool)) {
		return getWeaponMinScope(tool);
	} else if (isChip(tool)) {
		return getChipMinScope(tool);
	}
}
