//include("functions");
include("selectAction");
include("selectTarget");
include("selectWeapon");
include("move");
include("buff");
include("fire");

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