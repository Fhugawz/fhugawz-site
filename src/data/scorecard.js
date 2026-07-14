export const SCORECARD_MAX_SCORE = 80;

export const scorecardCategoryIds = [
	'artistIdentity',
	'sonicDirection',
	'visualNarrative',
	'releasePreparation',
	'audienceContent',
];

export const questionKey = (categoryId, questionIndex) => `${categoryId}-${questionIndex}`;

export const scorecardContent = {
	en: {
		meta: {
			title: 'Artist Identity & Release Readiness Scorecard',
			description:
				'A free diagnostic for independent artists to evaluate identity, sonic direction, visual world, release preparation and content systems.',
		},
		intro: {
			kicker: 'FREE ARTIST DI