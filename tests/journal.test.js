import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { journalEntries, selectedJournalEntries } from '../src/data/journal.ts';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const assertLocalized = (value, label) => {
	assert.equal(typeof value?.en, 'string', `${label}.en must be a string`);
	assert.equal(typeof value?.es, 'string', `${label}.es must be a string`);
	assert.ok(value.en.trim(), `${label}.en must not be empty`);
	assert.ok(value.es.trim(), `${label}.es must not be empty`);
};

test('Journal metadata is unique, bilingual, and points to preserved Blog entries', () => {
	assert.equal(journalEntries.length, 6);
	assert.equal(new Set(journalEntries.map((entry) => entry.slug)).size, journalEntries.length);
	assert.equal(new Set(journalEntries.map((entry) => entry.href)).size, journalEntries.length);

	journalEntries.forEach((entry) => {
		assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/);
		assert.ok(entry.href.startsWith('/blog/'), `${entry.slug} must point to a preserved Blog route`);
		assertLocalized(entry.category, `${entry.slug}.category`);
		assertLocalized(entry.title, `${entry.slug}.title`);
		assertLocalized(entry.excerpt, `${entry.slug}.excerpt`);
		assertLocalized(entry.alt, `${entry.slug}.alt`);
		assert.ok(existsSync(path.join(projectRoot, 'public', entry.image.slice(1))), `${entry.slug} image must exist`);
	});
});

test('the artist-facing Journal selection is limited to three entries without commercial destinations', () => {
	assert.equal(selectedJournalEntries.length, 3);
	selectedJournalEntries.forEach((entry) => {
		assert.equal(entry.selected, true);
		assert.doesNotMatch(entry.href, /^\/(services|resources|project-brief|brief)(\/|$)/);
	});
});
