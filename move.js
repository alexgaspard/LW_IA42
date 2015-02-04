include("functions");
include("fire");

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