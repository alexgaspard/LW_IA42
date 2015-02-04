//include("functions");
include("selectWeapon");

var action = selectAction();
var target = selectTarget(action);

debug("Target: "+getName(target));
debug("Allies: "+getAlliesCount());

if (isAlive(target) and (getCell(target)!=null)) {
	//debug("selectWeapon");
	selectWeapon(action, target);
	//debug("move");
	move(action, target);
	//debug("buff");
	buff(); // A ranger dans selectAction() plus tard
	//debug("haveFun");
	haveFun(target);
}

function selectAction() {
	return 1; // Attack
}

function haveFun(target) {	
	if (getTurn() < 2) {
		say("Mess with the best, die with the rest.");
	} 
	if (getLife()<30) {
		say("I will perish with honor.");
	} else if (getLife(target)<30) {
		say("You fought with honor.");
	}
}

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

function buff() {
	if (((getTurn()-1) % getChipCooldown(CHIP_STEROID)) < 1) {
		if (inArray(getChips(), CHIP_STEROID)) {
			while (useChip(CHIP_STEROID, getLeek()) == USE_FAILED);
		}
	}
	if (((getTurn()-1) % getChipCooldown(CHIP_HELMET)) < 1) {
		if (inArray(getChips(), CHIP_HELMET)) {
			while (useChip(CHIP_HELMET, getLeek()) == USE_FAILED);
		}
	}
	if (((getTurn()-1) % getChipCooldown(CHIP_BANDAGE)) < 1) {
		if (getLife()<getTotalLife()) {
			if (inArray(getChips(), CHIP_BANDAGE)) {
				while (useChip(CHIP_BANDAGE, getLeek()) == USE_FAILED);
			}
		}
	}
}

function move(action, enemy) {
	// Determine the best movement
	while (getMP()>0) {
		if (getDistanceEnemy(enemy) == 0) {break;}
		else if (getTP()<getWeaponCost(getWeapon())) {
			debug("No more TP");
			if (getAlliesCount()<2) {
				if (moveAwayFrom(enemy) == 0) {break;}
			} else {
				break;
			}
		} else if (getDistanceEnemy(enemy) <= getToolMaxScope(getWeapon())) {
			// TODO Change with a generic function for all tools
			debug("Within reach weapon");
			if (fire(getWeapon(), enemy) == USE_INVALID_POSITION) {
				fire(CHIP_SPARK, enemy);
			}
		} else if ((getDistanceEnemy(enemy)-getMP()) <= getToolMaxScope(getWeapon())) {
			debug("Can reach him with weapon");
			moveToward(enemy, 1);
			if (getMP()<1) {fire(getWeapon(), enemy);}
		} else if (getDistanceEnemy(enemy) <= getToolMaxScope(CHIP_SPARK)) {
			debug("Within reach spark");
			fire(CHIP_SPARK, enemy);
		} else if ((getDistanceEnemy(enemy)-getMP()) <= getToolMaxScope(CHIP_SPARK)) {
			debug("Can reach him with spark");
			moveToward(enemy, 1);
			if (getMP()<1) {fire(CHIP_SPARK, enemy);}
		} else if ((getDistanceEnemy(enemy)-getMP(enemy)-getMP()) <= getToolMaxScope(CHIP_SPARK)) {
			debug("Can get hit if I move");
			if (getAlliesCount()>1) {
				debug("All for the team!");
				moveToward(enemy, 1);
			} else if (getTurn() < 10) {
				debug("Wait");
				break;
			} else {
				debug("Will not wait forever");
				moveToward(enemy, 1);
			}
		} else {
			debug("Cannot get hit even if I move");
			moveToward(enemy, 1);
		}
	}
}

function fire(tool, enemy) {
	if (isWeapon(tool)) {
		return fire_weapon(tool, enemy);
	} else if (isChip(tool)) {
		return fire_chip(tool, enemy);
	}
}

function fire_chip(tool, enemy) {
	if (inArray(getChips(), tool)) {
		if (getDistanceEnemy(enemy) <= getChipMaxScope(tool)) {
			while (getTP()>=getChipCost(tool)) {
				var my_TP = getTP();
				var returnValue = useChip(tool, enemy);
				if (my_TP == getTP()) {
					return returnValue;
				}
				if (getTP()<getChipCost(tool)) {
					return returnValue;
				}
			}			
		}
	}
}

function fire_weapon(tool, enemy) {
	if (inArray(getWeapons(), tool)) {
		if (getWeapon() != tool) {
			setWeapon(tool); // Attention : coûte 1 PT
		}
		if (getDistanceEnemy(enemy) <= getWeaponMaxScope(getWeapon())) {
			while (getTP()>=getWeaponCost(getWeapon())) {
				var my_TP = getTP();
				var returnValue = useWeapon(enemy);
				if (my_TP == getTP()) {
					return returnValue;
				}
				if (getTP()<getWeaponCost(tool)) {
					return returnValue;
				}
			}
		}
	}
}