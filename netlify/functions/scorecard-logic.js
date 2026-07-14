export const categoryIds = ['artistIdentity', 'sonicDirection', 'visualNarrative', 'releasePreparation', 'audienceContent'];

export const questionKeys = categoryIds.flatMap((categoryId) =>
  [0, 1, 2, 3].map((index) => `${categoryId}-${index}`),
);

export const normalizeAnswers = (input) => {
  if (!input || typeof input !== 'object' || Object.keys(input).length !== questionKeys.length) return null;
 