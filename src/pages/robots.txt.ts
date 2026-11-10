import type { APIRoute } from 'astro';

export const GET: APIRoute = () => new Response(
	process.env.CONTEXT === 'production'
		? 'User-agent: *\nAllow: /\n\nSitemap: https://fhugawz.com/sitemap.xml\n'
		: 'User-agent: *\nDisallow: /\n',
	{ headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
