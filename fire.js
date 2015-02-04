include("functions");

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