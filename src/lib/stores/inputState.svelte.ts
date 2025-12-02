// Tracks when features (like games) need to own keyboard and pointer-like controls.
export const inputState = $state({
	lockOwner: null as string | null,
	crosshairSuppressed: false,

	lockControls(source: string) {
		this.lockOwner = source;
		this.crosshairSuppressed = true;
	},

	releaseControls(source: string) {
		if (this.lockOwner === source) {
			this.lockOwner = null;
			this.crosshairSuppressed = false;
		}
	},

	get isLocked() {
		return this.lockOwner !== null;
	}
});
