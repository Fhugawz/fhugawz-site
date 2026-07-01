const displayValueLabels = {
	artist_world_building: 'Artist World Building',
	demo_reconstruction: 'Demo Reconstruction',
	music_production: 'Music Production',
	mixing_mastering: 'Mixing / Mastering',
	'music-production': 'Music Production',
	'mixing-mastering': 'Mixing / Mastering',
	'demo-reconstruction': 'Demo Reconstruction',
	'artist-world-building': 'Artist World Building',
	general: 'General Inquiry',
	full_direction: 'Full Direction',
	advanced: 'Advanced',
	standard: 'Standard',
	essential: 'Essential',
	not_sure: 'Not Sure Yet',
	not_sure_yet: 'Not Sure Yet',
	email: 'Email',
	whatsapp: 'WhatsApp',
	instagram: 'Instagram',
	close: 'Close',
	moderate: 'Moderate',
	open: 'Open',
	full_reconstruction: 'Full Reconstruction',
	suno: 'Suno',
	udio: 'Udio',
	other: 'Other',
	yes: 'Yes',
	no: 'No',
	true: 'Yes',
	false: 'No',
	vocal_presence: 'Vocal Presence',
	low_end: 'Low End',
	punch: 'Punch',
	depth: 'Depth',
	stereo_image: 'Stereo Image',
	loudness: 'Loudness',
	darkness: 'Darkness',
	clarity: 'Clarity',
	translation: 'Translation',
};

const displayLabelFields = new Set([
	'requested_service',
	'selected_service',
	'service_type',
	'level_of_support',
	'preferred_contact',
	'ai_platform',
	'creative_changes',
	'newsletter_consent',
	'main_concerns',
	'project_stage',
	'desired_outcome',
]);

const valueToText = (value) => {
	if (Array.isArray(value)) return value.join(', ');
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (value && typeof value === 'object') return JSON.stringify(value);
	return String(value || '');
};

const shouldPreserveText = (text) =>
	!text ||
	text.length > 80 ||
	/[\r\n]/.test(text) ||
	/https?:\/\/|www\./i.test(text) ||
	(text.includes(' ') && !/[_-]/.test(text));

const titleCaseEnum = (text) =>
	text
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/\b\w/g, (letter) => letter.toUpperCase());

export const valueToDisplayLabel = (value) => {
	if (Array.isArray(value)) return value.map(valueToDisplayLabel).filter(Boolean).join(', ');
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (value && typeof value === 'object') return JSON.stringify(value);

	const text = String(value || '').trim();
	const key = text.toLowerCase();
	if (Object.prototype.hasOwnProperty.call(displayValueLabels, key)) {
		return displayValueLabels[key];
	}

	if (shouldPreserveText(text)) return text;
	return titleCaseEnum(text);
};

export const valueToDisplayText = (fieldName, value) => {
	if (!displayLabelFields.has(fieldName)) return valueToText(value);
	return valueToDisplayLabel(value);
};

export const displayLabels = displayValueLabels;
