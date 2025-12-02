import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const validSlugs = new Set(['asteroids', 'snake', 'pong']);

export const load: PageLoad = ({ params }) => {
	const slug = params.slug?.toLowerCase();

	if (slug === 'astroid') {
		throw redirect(307, '/games/asteroids');
	}

	if (!slug || !validSlugs.has(slug)) {
		throw error(404, 'Game not found');
	}

	return { slug };
};
