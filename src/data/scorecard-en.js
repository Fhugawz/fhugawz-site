export const scorecardEn = {
	meta: {
		title: 'Artist Identity & Release Readiness Scorecard',
		description: 'A free diagnostic for independent artists to evaluate identity, sonic direction, visual world, release preparation and content systems.',
	},
	intro: {
		kicker: 'FREE ARTIST DIAGNOSTIC',
		title: 'How ready is your artist world for the next release?',
		body: 'Evaluate five parts of your project in 5–8 minutes. You will receive a score, your strongest and weakest areas, and three practical next steps.',
		privacy: 'This prototype works entirely in your browser. It does not collect your email or save your answers.',
		start: 'START SCORECARD',
	},
	ui: {
		question: 'Question', of: 'of', previous: 'PREVIOUS', next: 'NEXT', results: 'VIEW RESULTS',
		answerRequired: 'Choose one answer before continuing.', restart: 'RESTART SCORECARD',
		totalScore: 'TOTAL READINESS SCORE', strongest: 'Strongest area', weakest: 'Priority area',
		categoryScores: 'Category scores', nextSteps: 'Your next three steps', recommendation: 'Recommended direction',
	},
	scale: [
		{ value: 0, label: 'Not started', detail: 'This does not exist yet.' },
		{ value: 1, label: 'Early idea', detail: 'A vague or isolated idea exists.' },
		{ value: 2, label: 'Partially defined', detail: 'There is progress, but clarity or consistency is missing.' },
		{ value: 3, label: 'Mostly clear', detail: 'It works, though it still needs refinement.' },
		{ value: 4, label: 'Fully defined', detail: 'It is clear, documented and used consistently.' },
	],
	categories: {
		artistIdentity: {
			name: 'Artist Identity',
			description: 'Clarity about who the artist is and what the project represents.',
			questions: [
				'I can explain in one clear sentence who I am as an artist and what makes my project distinct.',
				'I have defined the themes, emotions or conflicts that repeatedly appear in my work.',
				'I know what kind of experience I want someone to feel when discovering my project.',
				'My creative decisions come from my own identity, not only from imitating references.',
			],
		},
		sonicDirection: {
			name: 'Sonic Direction',
			description: 'Definition and coherence of the musical language.',
			questions: [
				'I can describe my sonic direction without relying only on the names of other artists.',
				'I have a recognizable palette of genres, textures, instruments, production choices or atmospheres.',
				'My recent songs or demos feel as if they belong to the same universe, even when they vary.',
				'I know which musical elements should remain constant and which may change between releases.',
			],
		},
		visualNarrative: {
			name: 'Visual & Narrative World',
			description: 'Connection between image, story, symbols and emotion.',
			questions: [
				'I have a defined visual direction for color, typography, imagery, texture and composition.',
				'My covers, profiles, images and visual assets communicate a coherent feeling.',
				'Symbols, stories, characters, places or concepts expand the meaning of my music.',
				'I can translate the emotional world of a song into concrete visual and narrative decisions.',
			],
		},
		releasePreparation: {
			name: 'Release Preparation',
			description: 'Concrete readiness of the next release.',
			questions: [
				'I have defined my next release and the role it plays within my project.',
				'The song, artwork, credits, metadata and required files each have a clear status.',
				'I have a realistic date or release window and a schedule for actions before and after release.',
				'I know what must happen before publishing and what indicators I will review afterward.',
			],
		},
		audienceContent: {
			name: 'Audience & Content System',
			description: 'Ability to communicate, publish and sustain attention.',
			questions: [
				'I know the kind of person I want to connect with and why my project may matter to them.',
				'I have content themes or pillars related to my identity, not only promotional posts.',
				'I can turn a song, concept or process into several useful content pieces.',
				'I have a sustainable system to create, review, publish and measure content without relying on daily inspiration.',
			],
		},
	},
	results: {
		fragmented: { title: 'Fragmented Foundation', diagnosis: 'Ideas and materials exist, but they do not yet form a usable identity or release system.', priority: 'Define foundation, intention and direction before increasing production or promotion.' },
		emerging: { title: 'Emerging Direction', diagnosis: 'Your identity is beginning to form, but several decisions remain scattered or depend too much on external references.', priority: 'Document the direction and connect sound, image, narrative and release.' },
		disconnected: { title: 'Defined but Disconnected', diagnosis: 'Most components exist, but they do not yet work as a consistent and repeatable system.', priority: 'Close the gaps between areas and turn creative decisions into processes.' },
		ready: { title: 'Release-Ready System', diagnosis: 'A solid and coherent direction exists and is sufficiently prepared to support an intentional release.', priority: 'Execute, measure and improve without losing coherence.' },
	},
	actions: {
		artistIdentity: ['Write a one-sentence artist definition.', 'List three recurring themes or emotional conflicts.', 'Define the experience a new listener should feel.'],
		sonicDirection: ['Describe your sound without artist names.', 'Create a short sonic palette of recurring elements.', 'Mark what must stay constant across releases.'],
		visualNarrative: ['Define a compact visual system.', 'Choose recurring symbols or narrative elements.', 'Translate one song into a visual direction page.'],
		releasePreparation: ['Define the role of the next release.', 'Create a status checklist for every required asset.', 'Build a realistic before-and-after release timeline.'],
		audienceContent: ['Describe the person you want to reach.', 'Define three content pillars tied to your identity.', 'Turn one release idea into five content pieces.'],
	},
	recommendations: {
		artistIdentity: 'Begin with an artist identity foundation exercise or an Artist World Building direction session.',
		sonicDirection: 'Build a sonic identity map before adding more production decisions.',
		visualNarrative: 'Create a world-building canvas and a compact visual direction system.',
		releasePreparation: 'Use a release checklist and convert the project into a repeatable release system.',
		audienceContent: 'Build content pillars and a release-content workflow that can be sustained.',
	},
};
