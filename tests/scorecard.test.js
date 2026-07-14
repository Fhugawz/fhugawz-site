import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScorecard, categoryIds, getResultId, questionKey } from '../src/data/scorecard.js';

const answersWithValue = (value) => Object.fromEntries(
	categoryIds.flatMap((categoryId) => [0, 1, 2, 3].map((index) => [questionKey(categoryId, index), value])),
);

const answersForTotal = (total) => {
	const answers = answersWithValue(0);
	let remaining = total;
	for (const categoryId of categoryIds) {
		for (let index = 0; index < 4; index += 1) {
			const value = Math.min(4, remaining);
			answers[questionKey(categoryId, index)] = value;
			remaining -= value;
		}
	}
	return answers;
};

test('result boundaries map to the correct ranges', () => {
	assert.equal(getResultId(0), 'fragmented');
	assert.equal(getResultId(20), 'fragmented');
	assert.equal(getResultId(21), 'emerging');
	assert.equal(getResultId(40), 'emerging');
	assert.equal(getResultId(41), 'disconnected');
	assert.equal(getResultId(60), 'disconnected');
	assert.equal(getResultId(61), 'ready');
	assert.equal(getResultId(80), 'ready');
});

test('all zero answers produce a zero score and five-way tie', () => {
	const result = calculateScorecard(answersWithValue(0));
	assert.equal(result.total, 0);
	assert.equal(result.percentage, 0);
	assert.deepEqual(result.strongest, categoryIds);
	assert.deepEqual(result.weakest, categoryIds);
});

test('all maximum answers produce 80 points', () => {
	const result = calculateScorecard(answersWithValue(4));
	assert.equal(result.total, 80);
	assert.equal(result.percentage, 100);
	assert.equal(result.resultId, 'ready');
	categoryIds.forEach((id) => assert.equal(result.categoryScores[id], 16));
});

test('category scoring identifies strongest and weakest areas', () => {
	const answers = answersWithValue(2);
	for (let index = 0; index < 4; index += 1) {
		answers[questionKey('artistIdentity', index)] = 4;
		answers[questionKey('audienceContent', index)] = 0;
	}
	const result = calculateScorecard(answers);
	assert.deepEqual(result.strongest, ['artistIdentity']);
	assert.deepEqual(result.weakest, ['audienceContent']);
	assert.equal(result.categoryScores.artistIdentity, 16);
	assert.equal(result.categoryScores.audienceContent, 0);
});

test('calculation preserves every required boundary total', () => {
	[0, 20, 21, 40, 41, 60, 61, 80].forEach((total) => {
		assert.equal(calculateScorecard(answersForTotal(total)).total, total);
	});
});
