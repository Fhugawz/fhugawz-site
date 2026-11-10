export type Language = 'en' | 'es';

export type LocalizedText = {
	en: string;
	es: string;
};

export type WorldStage =
	| 'concept'
	| 'ai-prototype'
	| 'selection'
	| 'human-reconstruction'
	| 'production'
	| 'mix-master'
	| 'released';

export type TrackStatus = 'prototype' | 'reconstruction' | 'official';

export type ReleaseLinks = {
	spotify?: string;
	youtube?: string;
	appleMusic?: string;
	bandcamp?: string;
	soundcloud?: string;
};

export type WorldPreview = {
	src: string;
	durationSeconds?: number;
};

export type WorldTrack = {
	id: string;
	title: string;
	status: TrackStatus;
	description: LocalizedText;
	preview?: WorldPreview;
	artwork?: {
		src: string;
		alt: LocalizedText;
	};
	externalPrototypeUrl?: string;
	releaseLinks?: ReleaseLinks;
};

export type WorldArtwork = {
	card: string;
	hero: string;
	social?: string;
	alt: LocalizedText;
	placeholder: boolean;
};

export type World = {
	order: number;
	slug: string;
	title: string;
	displayNumber: string;
	stage: WorldStage;
	featured: boolean;
	published: boolean;
	sunoAlbumUrl: string;
	genre: LocalizedText;
	summary: LocalizedText;
	narrative: LocalizedText;
	quote?: LocalizedText;
	themes: LocalizedText[];
	artwork: WorldArtwork;
	tracks: WorldTrack[];
	prototypePlaylistUrl?: string;
	officialReleaseDate?: string;
	releaseLinks?: ReleaseLinks;
	seo: {
		title: LocalizedText;
		description: LocalizedText;
		image?: string;
	};
};
