

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