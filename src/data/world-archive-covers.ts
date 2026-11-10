import { canonicalWorldSlugs, worlds } from './worlds.ts';

type CanonicalWorldSlug = (typeof canonicalWorldSlugs)[number];

export const worldArchiveCovers = Object.fromEntries(
	worlds.map((world) => [world.slug, world.artwork.card]),
) as Record<CanonicalWorldSlug, string>;

export function getWorldArchiveCover(slug: string, fallback: string): string {
	return worldArchiveCovers[slug as CanonicalWorldSlug] ?? fallback;
}
