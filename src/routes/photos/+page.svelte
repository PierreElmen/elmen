<script lang="ts">
	import PhotoGallery from '$lib/components/PhotoGallery.svelte';

	// Import all photos
	import photo1 from '$lib/assets/images/photos/0540B02A-2538-434E-831A-C3C954602FA2.jpeg';
	import photo2 from '$lib/assets/images/photos/095A13A5-F693-482C-8DB2-34E310DD74CD.jpeg';
	import photo3 from '$lib/assets/images/photos/24A9DCC5-D8FD-462C-BB73-1CAF6B71B749.jpeg';
	import photo4 from '$lib/assets/images/photos/2C9CC845-6428-4F5A-A91D-E5E846DF177D.jpeg';
	import photo5 from '$lib/assets/images/photos/3A5C7BCB-878A-4853-B2CD-36DD41310437.jpeg';
	import photo6 from '$lib/assets/images/photos/3A7D4371-C76F-4A66-9076-DC22DC04E33A.jpeg';
	import photo7 from '$lib/assets/images/photos/407274CF-091B-446B-B43A-64F7B8C0DDDC.jpeg';
	import photo8 from '$lib/assets/images/photos/44839140-25AF-4711-8542-E0D81D845528.jpeg';
	import photo9 from '$lib/assets/images/photos/5CE8D11E-512A-4A4B-996B-0DD0BF4F675E.jpeg';
	import photo10 from '$lib/assets/images/photos/82FD99D0-05CF-4A3D-A468-CC28F9226522.jpeg';
	import photo11 from '$lib/assets/images/photos/9E2E376D-C628-4FEE-89DD-F75315DC58D6.jpeg';
	import photo12 from '$lib/assets/images/photos/A3986E25-6935-4881-B7D9-4AFB2C15D57D.jpeg';
	import photo13 from '$lib/assets/images/photos/CBB80A70-2A22-4604-9D87-1CBCCF06EEF2.jpeg';
	import photo14 from '$lib/assets/images/photos/D6690D62-8FCA-4611-B430-1DD2D5FE328B.jpeg';
	import photo15 from '$lib/assets/images/photos/E2ABB1EF-9C16-43A2-B9F4-960E87F24DAB.jpeg';
	import photo16 from '$lib/assets/images/photos/IMG_1719.jpeg';

	// Photo data - will be replaced with Supabase data in the future
	const photos = [
		{ id: 1, src: photo1, alt: 'Photo 1' },
		{ id: 2, src: photo2, alt: 'Photo 2' },
		{ id: 3, src: photo3, alt: 'Photo 3' },
		{ id: 4, src: photo4, alt: 'Photo 4' },
		{ id: 5, src: photo5, alt: 'Photo 5' },
		{ id: 6, src: photo6, alt: 'Photo 6' },
		{ id: 7, src: photo7, alt: 'Photo 7' },
		{ id: 8, src: photo8, alt: 'Photo 8' },
		{ id: 9, src: photo9, alt: 'Photo 9' },
		{ id: 10, src: photo10, alt: 'Photo 10' },
		{ id: 11, src: photo11, alt: 'Photo 11' },
		{ id: 12, src: photo12, alt: 'Photo 12' },
		{ id: 13, src: photo13, alt: 'Photo 13' },
		{ id: 14, src: photo14, alt: 'Photo 14' },
		{ id: 15, src: photo15, alt: 'Photo 15' },
		{ id: 16, src: photo16, alt: 'Photo 16' }
	];

	/* Future Supabase implementation:
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let photos = $state([]);
	
	onMount(async () => {
		const { data, error } = await supabase
			.from('photos')
			.select('*')
			.order('date_taken', { ascending: false });
		
		if (data) photos = data;
	});
	*/
</script>

<PhotoGallery {photos} />
