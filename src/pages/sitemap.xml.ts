import type { APIRoute } from 'astro';
import { publishedWorlds } from '../data/worlds';
import { journalEntries, journalPageCount } from '../data/journal';

export const GET: APIRoute = () => {
	const paths = [
		'/', '/worlds',
		...publishedWorlds.map((world) => `/worlds/${world.slug}`),
		'/journal',
		...Array.from({ length: Math.max(0, journalPageCount - 1) }, (_, index) => `/journal/${index + 2}`),
		...journalEntries.map((entry) => entry.href),
		'/contact', '/privacy-policy', '/cookie-policy', '/copyright-notice',
	];
	const urls = [...new Set(paths)].map((path) => `  <url><loc>${new URL(path === '/' ? '/' : `${path}/`, 'https://fhugawz.com').href}</loc></url>`).join('\n');
	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
