import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const site = 'https://fhugawz.com';
const worlds = [
	'199x', 'fake-minds', 'meriland', 'axioms', 'protocol-7', 'lost', 'nadir',
	'moria', 'phobia', 'soliloquium', 'nowhere', '314', 'henosis',
];
const articles = [
	'building-axioms', 'why-fhugawz-exists', 'sound-of-reconstruction',
	'every-album-is-an-era', 'dark-visuals-make-music-memorable', 'songs-need-more-than-production',
];
const indexable = [
	'/', '/worlds', ...worlds.map((slug) => `/worlds/${slug}`), '/journal',
	...articles.map((slug) => `/blog/${slug}`), '/contact', '/privacy-policy', '/cookie-policy', '/copyright-notice',
];
const retired = ['/blog', '/music', '/terms-of-service', '/projects', '/projects/archive', '/projects/199x', '/projects/axioms', '/projects/protocol-7'];

function pageFile(path) {
	return join(root, path === '/' ? 'index.html' : `${path.slice(1)}/index.html`);
}

test('production output has complete, unique metadata and one main heading per indexable URL', () => {
	const canonicals = new Set();
	for (const path of indexable) {
		const file = pageFile(path);
		assert.ok(existsSync(file), `missing generated page: ${path}`);
		const html = readFileSync(file, 'utf8');
		const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
		const desc = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
		const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
		assert.ok(title, `${path} has no title`);
		assert.ok(desc?.trim(), `${path} has no meta description`);
		assert.ok(canonical, `${path} has no canonical`);
		assert.equal(canonical, `${site}${path === '/' ? '/' : `${path}/`}`, `${path} canonical mismatch`);
		assert.equal(html.match(/<meta\b[^>]*property="og:url"[^>]*content="([^"]+)"/i)?.[1], canonical, `${path} Open Graph URL differs from canonical`);
		assert.ok(!canonicals.has(canonical), `duplicate canonical: ${canonical}`);
		canonicals.add(canonical);
		assert.ok(!/<meta\b[^>]*name="robots"[^>]*noindex/i.test(html), `${path} is unexpectedly noindex`);
		assert.equal((html.match(/<main\b/gi) || []).length, 1, `${path} must have exactly one main landmark`);
		assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${path} must have exactly one h1`);
		assert.match(html, /property="og:title"/i, `${path} has no Open Graph title`);
		assert.match(html, /property="og:description"/i, `${path} has no Open Graph description`);
		assert.match(html, /property="og:image"/i, `${path} has no Open Graph image`);
		assert.match(html, /name="twitter:card" content="summary_large_image"/i, `${path} has no large Twitter card`);
		const socialImage = html.match(/<meta\b[^>]*property="og:image"[^>]*content="([^"]+)"/i)?.[1];
		assert.ok(socialImage, `${path} has no Open Graph image URL`);
		const socialImageUrl = new URL(socialImage);
		if (socialImageUrl.origin === site) assert.ok(existsSync(join(root, socialImageUrl.pathname.slice(1))), `${path} references missing social image ${socialImageUrl.pathname}`);
		const twitterImage = html.match(/<meta\b[^>]*name="twitter:image"[^>]*content="([^"]+)"/i)?.[1];
		assert.equal(twitterImage, socialImage, `${path} Open Graph and Twitter images differ`);
		assert.match(html, /property="og:image:alt" content="[^"]+"/i, `${path} social image has no alt text`);
		const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
		if (['/', '/worlds', '/journal'].includes(path) || path.startsWith('/worlds/') || path.startsWith('/blog/')) {
			assert.ok(schema, `${path} has no applicable JSON-LD`);
			let parsedSchema;
			assert.doesNotThrow(() => { parsedSchema = JSON.parse(schema); }, `${path} has invalid JSON-LD`);
			const entities = Array.isArray(parsedSchema) ? parsedSchema : [parsedSchema];
			if (path.startsWith('/worlds/')) {
				assert.ok(entities.some((entity) => entity['@type'] === 'CreativeWork'), `${path} should identify the World as a CreativeWork`);
				assert.ok(!entities.some((entity) => entity['@type'] === 'MusicAlbum'), `${path} should not claim a prototype is a released music album`);
				assert.equal(entities.find((entity) => entity['@type'] === 'CreativeWork')?.url, canonical, `${path} schema URL differs from canonical`);
			}
			if (path.startsWith('/blog/')) assert.equal(entities.find((entity) => entity['@type'] === 'BlogPosting')?.mainEntityOfPage, canonical, `${path} article schema URL differs from canonical`);
			if (['/', '/worlds', '/journal'].includes(path)) assert.equal(entities[0].url, canonical, `${path} collection schema URL differs from canonical`);
		}
		for (const [, source] of html.matchAll(/<img\b[^>]*\bsrc="(\/[^"#?]+)"/gi)) {
			assert.ok(existsSync(join(root, source.slice(1))), `${path} references missing image ${source}`);
		}
	}
	assert.equal(canonicals.size, indexable.length);
});

test('internal links from indexable pages resolve to a generated route, asset, or configured redirect', () => {
	const config = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
	const redirects = new Set([...config.matchAll(/from = "([^"]+)"/g)].map((match) => match[1].replace(/\/$/, '')));
	for (const path of indexable) {
		const html = readFileSync(pageFile(path), 'utf8');
		for (const [, href] of html.matchAll(/\bhref="(\/[^"#]*)"/gi)) {
			const pathname = decodeURIComponent(new URL(href, site).pathname).replace(/\/$/, '') || '/';
			const routeExists = existsSync(pageFile(pathname));
			const assetExists = existsSync(join(root, pathname.slice(1)));
			assert.ok(routeExists || assetExists || redirects.has(pathname), `${path} links to missing local path ${pathname}`);
		}
	}
});

test('production sitemap and robots contain only the intended indexable pages', () => {
	const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
	const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
	assert.equal(urls.length, indexable.length);
	assert.equal(new Set(urls).size, urls.length);
	for (const path of indexable) assert.ok(urls.includes(`${site}${path === '/' ? '/' : `${path}/`}`), `sitemap missing ${path}`);
	for (const path of retired) assert.ok(!urls.some((url) => new URL(url).pathname === `${path}/` || new URL(url).pathname === path), `sitemap includes retired route ${path}`);
	const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
	assert.match(robots, /User-agent: \*\s+Allow: \/\s+\s*Sitemap: https:\/\/fhugawz\.com\/sitemap\.xml/);
});

test('retired and redirected routes stay out of the index', () => {
	for (const path of retired) {
		const file = pageFile(path);
		if (!existsSync(file)) continue;
		const html = readFileSync(file, 'utf8');
		assert.match(html, /name="robots" content="noindex, nofollow"/i, `${path} should be noindex`);
	}
	const config = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
	assert.match(config, /from = "\/blog"[\s\S]*?to = "\/journal"[\s\S]*?status = 301/);
	assert.match(config, /from = "\/music"[\s\S]*?to = "\/worlds"[\s\S]*?status = 301/);
	assert.match(config, /from = "\/terms-of-service"[\s\S]*?to = "\/privacy-policy"[\s\S]*?status = 301/);
});
