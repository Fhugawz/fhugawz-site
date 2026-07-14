export const SCORECARD_MAX_SCORE = 80;

export const categoryIds = [
	'artistIdentity',
	'sonicDirection',
	'visualNarrative',
	'releasePreparation',
	'audienceContent',
];

export const questionKey = (categoryId, questionIndex) => `${categoryId}-${questionIndex}`;

export const getResultId = (total) => {
	if (total <= 20) return 'fragmented';
	if (total <= 40) return 'emerging';
	if (total <= 60) return 'disconnected';
	return 'ready';
};

export const calculateScorecard = (answers) => {
	const categoryScores = Object.fromEntries(
		categoryIds.map((categoryId) => {
			const score = [0, 1, 2, 3].reduce(
				(sum, index) => sum + Number(answers[questionKey(categoryId, index)] ?? 0),
				0,
			);
			return [categoryId, score];
		}),
	);

	const total = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
	const values = Object.values(categoryScores);
	const strongestScore = Math.max(...values);
	const weakestScore = Math.min(...values);
	const strongest = categoryIds.filter((id) => categoryScores[id] === strongestScore);
	const weakest = categoryIds.filter((id) => categoryScores[id] === weakestScore);

	return {
		total,
		percentage: Math.round((total / SCORECARD_MAX_SCORE) * 100),
		resultId: getResultId(total),
		categoryScores,
		strongest,
		weakest,
	};
};
