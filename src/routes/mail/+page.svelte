<script lang="ts">
	import { goto } from '$app/navigation';
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { onMount } from 'svelte';

	// Redirect to home and open the contact panel
	onMount(() => {
		layoutState.openModal('contact');
		goto('/');
	});
</script>

<svelte:head>
	<title>Mail // Elmen_Dev</title>
</svelte:head>

<div class="mail-page">
	<p>Redirecting...</p>
</div>

<style>
	.mail-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 32px;
	}
</style>
