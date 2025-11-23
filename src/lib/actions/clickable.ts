import { mount, unmount } from 'svelte';
import { navigationState } from '$lib/stores/navigationStore.svelte';
import NumberOverlay from '$lib/components/ui/NumberOverlay.svelte';

export function clickable(node: HTMLElement) {
	// Register with store
	const id = navigationState.register(node);

	// Mount overlay
	// We need to ensure the node is positioned relative so the absolute overlay works
	const style = getComputedStyle(node);
	if (style.position === 'static') {
		node.style.position = 'relative';
	}

	const overlay = mount(NumberOverlay, {
		target: node,
		props: { number: id }
	});

	return {
		destroy() {
			navigationState.unregister(id);
			unmount(overlay);
		}
	};
}
