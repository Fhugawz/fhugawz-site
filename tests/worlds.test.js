import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { artistUi, worldStageLabels } from '../src/data/artist-ui.ts';
import { canonicalWorldSlugs, publishedWorlds, worlds } from '../src/data/worlds.ts';
import { worldArchiveCovers } from '../src/data/world-archive-covers.ts';
import { applyArtistLanguage, localize } from '../src/utils/localization.ts';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedSlugs = [
	'199x',
	'fake-minds',
	'meriland',
	'axioms',
	'protocol-7',
	'lost',
	'nadir',
	'moria',
	'phobia',
	'soliloquium',
	'nowhere',
	'314',
	'henosis',
];
const expectedLocalPreviews = {
	'199x': { title: 'Sweet isolation', src: '/audio/worlds/01-199x-preview.mp3' },
	'fake-minds': { title: 'Inhale exhale', src: '/audio/worlds/02-fakeminds-preview.mp3' },
	meriland: { title: 'Wind chimes', src: '/audio/worlds/03-meriland-preview.mp3' },
	axioms: { title: 'My survival self', src: '/audio/worlds/04-axioms-preview.mp3' },
	'protocol-7': { title: 'Anamnesis of the unlived', src: '/audio/worlds/05-protocol-7-preview.mp3' },
	lost: { title: 'Even if I hate it', src: '/audio/worlds/06-lost-preview.mp3' },
	nadir: { title: 'No escape', src: '/audio/worlds/07-nadir-preview.mp3' },
	moria: { title: 'The slasher', src: '/audio/worlds/08-moria-preview.mp3' },
	phobia: { title: 'The house', src: '/audio/worlds/09-phobia-preview.mp3' },
	soliloquium: { title: 'Rustborn', src: '/audio/worlds/10-soliloquium-preview.mp3' },
	nowhere: { title: 'Nightmares', src: '/audio/worlds/11-nowhere-preview.mp3' },
	'314': { title: '314', src: '/audio/worlds/12-314-preview.mp3' },
	henosis: { title: 'Uncanny valley', src: '/audio/worlds/13-henosis-preview.mp3' },
};
const expectedSunoAlbumUrls = {
	'199x': 'https://suno.com/album/07d838aa-864b-45c0-903c-a2d12abba180',
	'fake-minds': 'https://suno.com/album/0f5dc259-57ec-4d49-adc6-706a78ad5c54',
	meriland: 'https://suno.com/album/a8cc18b8-f911-4479-9356-3234418ab18f',
	axioms: 'https://suno.com/album/4031d9c0-25dc-47c6-b010-e87f2708b437',
	'protocol-7': 'https://suno.com/album/aea5696c-3e6e-47d4-8b91-1ca4f1b672c4',
	lost: 'https://suno.com/album/40395db9-dee8-498f-8d2b-606789d7024f',
	nadir: 'https://suno.com/album/90bcd3e2-f34b-4772-95d6-aff36a83fb2e',
	moria: 'https://suno.com/album/ffda3e98-4d56-4411-a75b-afe7869ac722',
	phobia: 'https://suno.com/album/ad47b2f0-1234-45f6-9303-075d13314701',
	soliloquium: 'https://suno.com/album/c49e04d1-9da4-4b4b-95e2-1c96f5c9a3a9',
	nowhere: 'https://suno.com/album/c029fa89-5028-4d05-b6ca-f2fdeaab3929',
	'314': 'https://suno.com/album/7f0371df-c504-4fff-94cb-6b7a02b0950b',
	henosis: 'https://suno.com/album/f828402e-dbb0-4ff5-86ad-6a7607433e56',
};

const assertLocalized = (value, label) => {
	assert.equal(typeof value?.en, 'string', `${label}.en must be a string`);
	assert.equal(typeof value?.es, 'string', `${label}.es must be a string`);
	assert.ok(value.en.trim(), `${label}.en must not be empty`);
	assert.ok(value.es.trim(), `${label}.es must not be empty`);
};

const assertLocalizedTree = (value, label = 'value') => {
	if (!value || typeof value !== 'object') return;
	if ('en' in value || 'es' in value) {
		assertLocalized(value, label);
		return;
	}
	Object.entries(value).forEach(([key, child]) => assertLocalizedTree(child, `${label}.${key}`));
};

const assertPublicAsset = (reference, label) => {
	assert.ok(reference.startsWith('/'), `${label} must use a root-relative public path`);
	const absolutePath = path.join(projectRoot, 'public', reference.slice(1));
	assert.ok(existsSync(absolutePath), `${label} does not exist: ${reference}`);
};

test('the canonical World sequence contains exactly 13 unique ordered entries', () => {
	assert.equal(worlds.length, 13);
	assert.equal(publishedWorlds.length, 13);
	assert.deepEqual([...canonicalWorldSlugs], expectedSlugs);
	assert.deepEqual(worlds.map((world) => world.slug), expectedSlugs);
	assert.deepEqual(worlds.map((world) => world.order), Array.from({ length: 13 }, (_, index) => index + 1));
	assert.equal(new Set(worlds.map((world) => world.slug)).size, worlds.length);
	assert.equal(new Set(worlds.map((world) => world.order)).size, worlds.length);
});

test('the homepage has exactly one data-driven featured World with listening available', () => {
	const featuredWorlds = publishedWorlds.filter((world) => world.featured);
	assert.equal(featuredWorlds.length, 1);
	assert.ok(featuredWorlds[0].tracks.some((track) => track.preview));
});

test('every World maps to its corresponding Suno album', () => {
	assert.equal(Object.keys(expectedSunoAlbumUrls).length, 13);
	worlds.forEach((world) => {
		assert.equal(world.sunoAlbumUrl, expectedSunoAlbumUrls[world.slug], `${world.slug} has the wrong Suno album URL`);
	});
});

test('every World has complete non-empty bilingual editorial and SEO data', () => {
	worlds.forEach((world) => {
		assertLocalized(world.genre, `${world.slug}.genre`);
		assertLocalized(world.summary, `${world.slug}.summary`);
		assertLocalized(world.narrative, `${world.slug}.narrative`);
		assertLocalized(world.artwork.alt, `${world.slug}.artwork.alt`);
		assertLocalized(world.seo.title, `${world.slug}.seo.title`);
		assertLocalized(world.seo.description, `${world.slug}.seo.description`);
		world.quote && assertLocalized(world.quote, `${world.slug}.quote`);
		world.themes.forEach((theme, index) => assertLocalized(theme, `${world.slug}.themes.${index}`));
		world.tracks.forEach((track, index) => {
			assertLocalized(track.description, `${world.slug}.tracks.${index}.description`);
			track.artwork && assertLocalized(track.artwork.alt, `${world.slug}.tracks.${index}.artwork.alt`);
		});
	});
});

test('all centralized artist interface and stage labels are bilingual', () => {
	assertLocalizedTree(artistUi, 'artistUi');
	assertLocalizedTree(worldStageLabels, 'worldStageLabels');
});

test('the additive localization utility resolves content and switches text, alt, and aria values', () => {
	const copy = { en: 'Worlds', es: 'Mundos' };
	assert.equal(localize(copy, 'en'), 'Worlds');
	assert.equal(localize(copy, 'es'), 'Mundos');

	const textElement = { dataset: { artistEn: 'Worlds', artistEs: 'Mundos' }, textContent: '' };
	const imageElement = { dataset: { artistAltEn: 'English alt', artistAltEs: 'Alt en español' }, alt: '' };
	const ariaElement = {
		dataset: { artistAriaEn: 'World navigation', artistAriaEs: 'Navegación de mundos' },
		attributes: {},
		setAttribute(name, value) { this.attributes[name] = value; },
	};
	const root = {
		querySelectorAll(selector) {
			if (selector === '[data-artist-en][data-artist-es]') return [textElement];
			if (selector === '[data-artist-alt-en][data-artist-alt-es]') return [imageElement];
			if (selector === '[data-artist-aria-en][data-artist-aria-es]') return [ariaElement];
			return [];
		},
	};

	applyArtistLanguage('es', root);
	assert.equal(textElement.textContent, 'Mundos');
	assert.equal(imageElement.alt, 'Alt en español');
	assert.equal(ariaElement.attributes['aria-label'], 'Navegación de mundos');
});

test('every referenced World asset and local preview exists', () => {
	worlds.forEach((world) => {
		assertPublicAsset(world.artwork.card, `${world.slug}.artwork.card`);
		assertPublicAsset(world.artwork.hero, `${world.slug}.artwork.hero`);
		world.artwork.social && assertPublicAsset(world.artwork.social, `${world.slug}.artwork.social`);
		world.seo.image && assertPublicAsset(world.seo.image, `${world.slug}.seo.image`);
		world.tracks.forEach((track, index) => {
			track.preview && assertPublicAsset(track.preview.src, `${world.slug}.tracks.${index}.preview`);
			track.artwork && assertPublicAsset(track.artwork.src, `${world.slug}.tracks.${index}.artwork`);
		});
	});
});

test('the Worlds archive maps every canonical World to an existing local cover', () => {
	assert.equal(Object.keys(worldArchiveCovers).length, expectedSlugs.length);
	expectedSlugs.forEach((slug) => assert.ok(Object.hasOwn(worldArchiveCovers, slug), `${slug} needs an archive cover`));
	Object.entries(worldArchiveCovers).forEach(([slug, cover]) => {
		assertPublicAsset(cover, `${slug}.archiveCover`);
	});
});

test('every World exposes exactly one local optimized audio preview', () => {
	const previewWorlds = worlds.filter((world) => world.tracks.some((track) => track.preview)).map((world) => world.slug);
	assert.deepEqual(previewWorlds, expectedSlugs);
	worlds.forEach((world) => {
		const previewTracks = world.tracks.filter((track) => track.preview);
		assert.equal(previewTracks.length, 1);
		assert.equal(previewTracks[0].title, expectedLocalPreviews[world.slug].title);
		assert.equal(previewTracks[0].preview.src, expectedLocalPreviews[world.slug].src);
	});
	worlds.flatMap((world) => world.tracks).forEach((track) => {
		if (!track.preview) return;
		assert.equal(track.status, 'prototype');
		assert.match(track.preview.src, /^\/audio\/worlds\/\d{2}-[a-z0-9-]+-preview\.mp3$/);
		assert.doesNotMatch(track.preview.src, /\.wav$/i);
	});
});
