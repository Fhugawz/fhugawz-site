import type { LocalizedText, WorldStage } from '../types/world';

const text = (en: string, es: string): LocalizedText => ({ en, es });

export const artistUi = {
	navigation: {
		home: text('Home', 'Inicio'),
		worlds: text('Worlds', 'Mundos'),
		journal: text('Journal', 'Diario'),
		contact: text('Contact', 'Contacto'),
		worldsIndex: text('Fhugawz Worlds', 'Mundos de Fhugawz'),
		worldSequence: text('World sequence navigation', 'Navegación de la secuencia de mundos'),
		mainNavigation: text('Main navigation', 'Navegación principal'),
		mobileNavigation: text('Mobile navigation', 'Navegación móvil'),
		homeLink: text('Fhugawz home', 'Inicio de Fhugawz'),
		brandLogoAlt: text('FHUGAWZ narrative music project', 'Proyecto musical narrativo FHUGAWZ'),
		exploreWorld: text('Explore World', 'Explorar mundo'),
		previousWorld: text('Previous World', 'Mundo anterior'),
		nextWorld: text('Next World', 'Mundo siguiente'),
		backToWorlds: text('Back to Worlds', 'Volver a Mundos'),
	},
	sections: {
		world: text('World', 'Mundo'),
		narrative: text('Narrative', 'Narrativa'),
		themes: text('Themes', 'Temas'),
		sound: text('Sound', 'Sonido'),
		listen: text('Listen', 'Escuchar'),
		currentStage: text('Current stage', 'Etapa actual'),
	},
	actions: {
		listenToPrototype: text('Listen to Prototype', 'Escuchar prototipo'),
		listenOn: text('Listen on', 'Escuchar en'),
	},
	status: {
		prototype: text('Prototype', 'Prototipo'),
		selectedPrototype: text('Selected Prototype', 'Prototipo seleccionado'),
		reconstruction: text('Human Reconstruction', 'Reconstrucción humana'),
		finalRelease: text('Final Release', 'Lanzamiento final'),
		inDevelopment: text('In Development', 'En desarrollo'),
		comingSoon: text('Coming soon', 'Próximamente'),
		unavailable: text('Not available yet', 'Aún no disponible'),
		prototypeDisclosure: text('Prototype / Not Final Release', 'Prototipo / No es el lanzamiento final'),
	},
	platforms: {
		suno: text('Suno', 'Suno'),
		spotify: text('Spotify', 'Spotify'),
		youtube: text('YouTube', 'YouTube'),
		appleMusic: text('Apple Music', 'Apple Music'),
		bandcamp: text('Bandcamp', 'Bandcamp'),
		soundcloud: text('SoundCloud', 'SoundCloud'),
		externalPlatform: text('External platform', 'Plataforma externa'),
	},
	player: {
		play: text('Play preview', 'Reproducir preview'),
		pause: text('Pause preview', 'Pausar preview'),
		visualizer: text('Audio visualizer for', 'Visualizador de audio para'),
	},
	social: {
		groupLabel: text('Fhugawz social links', 'Enlaces sociales de Fhugawz'),
		spotify: text('Listen to Fhugawz on Spotify', 'Escuchar a Fhugawz en Spotify'),
		youtube: text('Watch Fhugawz on YouTube', 'Ver Fhugawz en YouTube'),
		instagram: text('Follow Fhugawz on Instagram', 'Seguir a Fhugawz en Instagram'),
		tiktok: text('Follow Fhugawz on TikTok', 'Seguir a Fhugawz en TikTok'),
	},
	home: {
		seo: {
			title: text('Fhugawz — Narrative Music & Audiovisual Worlds', 'Fhugawz — Música narrativa y mundos audiovisuales'),
			description: text(
				'One story told through thirteen connected music worlds, from creative prototypes to human-directed releases.',
				'Una historia contada a través de trece mundos musicales conectados, desde prototipos creativos hasta lanzamientos dirigidos por humanos.'
			),
		},
		hero: {
			kicker: text('Narrative music universe', 'Universo musical narrativo'),
			imageAlt: text('Cinematic night atmosphere introducing the Fhugawz narrative universe.', 'Atmósfera nocturna cinematográfica que introduce el universo narrativo de Fhugawz.'),
			statement: text(
				'One story told through thirteen worlds, each stranger than the last.',
				'Una historia contada a través de trece mundos, cada uno más extraño que el anterior.'
			),
			description: text(
				'A narrative music and audiovisual project by Jean Guevara.',
				'Un proyecto musical narrativo y audiovisual de Jean Guevara.'
			),
			explore: text('Explore the Worlds', 'Explorar los mundos'),
			listen: text('Listen to Prototypes', 'Escuchar prototipos'),
		},
		project: {
			kicker: text('The project', 'El proyecto'),
			title: text('Music is the starting language — not its limit.', 'La música es el lenguaje inicial, no su límite.'),
			paragraphOne: text(
				'Fhugawz is a narrative musical universe told through thirteen connected worlds. The story begins in autobiographical memory and gradually moves toward speculative fiction, horror, surrealism and metaphysics.',
				'Fhugawz es un universo musical narrativo contado a través de trece mundos conectados. La historia comienza en la memoria autobiográfica y avanza gradualmente hacia la ficción especulativa, el horror, el surrealismo y la metafísica.'
			),
			paragraphTwo: text(
				'Music, narrative and visual direction form one system. The songs that exist today are creative prototypes for a gradual process of selection, human reconstruction and final production.',
				'La música, la narrativa y la dirección visual forman un solo sistema. Las canciones que existen hoy son prototipos creativos para un proceso gradual de selección, reconstrucción humana y producción final.'
			),
		},
		currentWorld: {
			kicker: text('Current world', 'Mundo actual'),
		},
		catalogue: {
			kicker: text('The complete sequence', 'La secuencia completa'),
			title: text('Thirteen Worlds', 'Trece mundos'),
			description: text(
				'Every World is a chapter. Together they move from memory toward increasingly unfamiliar territory.',
				'Cada mundo es un capítulo. Juntos avanzan desde la memoria hacia territorios cada vez más desconocidos.'
			),
			exploreArchive: text('Enter the complete archive', 'Entrar al archivo completo'),
			selectionLabel: text('Select a World', 'Seleccionar un mundo'),
		},
		workflow: {
			kicker: text('Process transparency', 'Transparencia del proceso'),
			title: text('From prototype to release', 'Del prototipo al lanzamiento'),
			description: text(
				'AI assisted material is used during exploration, not as the final identity of the project. Selected ideas move through human reconstruction, production, mixing and mastering before becoming official releases.',
				'El material asistido con IA se utiliza durante la exploración, no como la identidad final del proyecto. Las ideas seleccionadas pasan por reconstrucción humana, producción, mezcla y masterización antes de convertirse en lanzamientos oficiales.'
			),
		},
		listening: {
			kicker: text('Selected listening', 'Escucha seleccionada'),
			title: text('Prototype room', 'Sala de prototipos'),
				description: text(
				'Three short signals from Worlds currently in development. These recordings are creative prototypes, not final releases.',
				'Tres señales breves de mundos actualmente en desarrollo. Estas grabaciones son prototipos creativos, no lanzamientos finales.'
			),
			selectSignal: text('Select signal', 'Seleccionar señal'),
		},
		journal: {
			kicker: text('Field notes', 'Notas de campo'),
			title: text('Journal', 'Diario'),
			description: text(
				'Notes from inside the music, narrative and visual construction of Fhugawz.',
				'Notas desde el interior de la construcción musical, narrativa y visual de Fhugawz.'
			),
			viewAll: text('Enter the Journal', 'Entrar al diario'),
		},
		creator: {
			kicker: text('Creator / Direction', 'Creador / Dirección'),
			title: text('Jean Guevara', 'Jean Guevara'),
			role: text('Creator & Audiovisual Art Director behind Fhugawz', 'Creador y Director de Arte Audiovisual detrás de Fhugawz'),
			description: text(
				'Fhugawz brings music, narrative and visual systems together under one creative direction.',
				'Fhugawz reúne música, narrativa y sistemas visuales bajo una sola dirección creativa.'
			),
			imageAlt: text('Music, design and visual direction process behind Fhugawz.', 'Proceso de música, diseño y dirección visual detrás de Fhugawz.'),
			capabilities: [
				text('Narrative Development', 'Desarrollo narrativo'),
				text('Music Production', 'Producción musical'),
				text('Audiovisual Direction', 'Dirección audiovisual'),
				text('Visual World-Building', 'Construcción de mundos visuales'),
			],
		},
		closing: {
			kicker: text('The signal remains open', 'La señal permanece abierta'),
			title: text('Follow the story as it becomes real.', 'Sigue la historia mientras se vuelve real.'),
			description: text(
				'Enter through the music, return through the Journal, or open a direct channel.',
				'Entra por la música, regresa a través del diario o abre un canal directo.'
			),
			contact: text('Contact', 'Contacto'),
		},
	},
	journalPage: {
		seoTitle: text('Journal — Fhugawz', 'Diario — Fhugawz'),
		seoDescription: text(
			'Field notes on the music, narrative, prototypes and visual worlds behind Fhugawz.',
			'Notas de campo sobre la música, la narrativa, los prototipos y los mundos visuales detrás de Fhugawz.'
		),
		kicker: text('Journal', 'Journal'),
		title: text('Inside the Work', 'Dentro del proceso'),
		description: text(
			'Notes from inside the work: process, evolution, experiments, references and the decisions shaping Fhugawz as it develops.',
			'Notas desde dentro del proceso: evolución, experimentos, referencias y las decisiones que van dando forma a Fhugawz mientras el proyecto se desarrolla.'
		),
		readArticle: text('Read entry', 'Leer entrada'),
	},
	footer: {
		label: text('Narrative music & audiovisual worlds', 'Música narrativa y mundos audiovisuales'),
		description: text(
			'One story told through thirteen connected Worlds.',
			'Una historia contada a través de trece mundos conectados.'
		),
		support: text(
			'Prototypes become selections. Selections become human-directed releases.',
			'Los prototipos se convierten en selecciones. Las selecciones se convierten en lanzamientos dirigidos por humanos.'
		),
		socialLabel: text('Listen / Follow', 'Escuchar / Seguir'),
		legalNavigation: text('Legal links', 'Enlaces legales'),
		copyright: text('Copyright 2026 Fhugawz. All rights reserved.', 'Copyright 2026 Fhugawz. Todos los derechos reservados.'),
	},
	worldsPage: {
		seoTitle: text('Worlds — Fhugawz', 'Mundos — Fhugawz'),
		seoDescription: text(
			'Explore the 13 connected music worlds of Fhugawz, from early prototypes to future human-produced releases.',
			'Explora los 13 mundos musicales conectados de Fhugawz, desde los primeros prototipos hasta futuros lanzamientos producidos por humanos.'
		),
		kicker: text('THE ARCHIVE', 'ARCHIVO'),
		title: text('Thirteen Worlds, One Inner Sequence', 'Trece mundos, una secuencia interior'),
		description: text(
			'Thirteen connected worlds trace a changing inner state through sound, narrative and image. Each one forms a chapter in the same evolving work.',
			'Trece mundos conectados recorren distintos estados interiores a través del sonido, la narrativa y la imagen. Cada uno forma un capítulo de una misma obra en evolución.'
		),
		archiveStatus: text('Ongoing archive · prototypes in development', 'Archivo en desarrollo · prototipos en proceso'),
		close: text('Close', 'Cerrar'),
		previous: text('Previous world', 'Mundo anterior'),
		next: text('Next world', 'Mundo siguiente'),
		preview: text('Selected prototype preview', 'Preview de prototipo seleccionado'),
		suno: text('Listen to the full prototype on Suno', 'Escuchar el prototipo completo en Suno'),
		overlayNavigation: text('World sequence navigation', 'Navegación por la secuencia de mundos'),
	},
} as const;

export const worldStageLabels: Record<WorldStage, LocalizedText> = {
	concept: text('Concept', 'Concepto'),
	'ai-prototype': text('AI Prototype', 'Prototipo con IA'),
	selection: text('Selection', 'Selección'),
	'human-reconstruction': text('Human Reconstruction', 'Reconstrucción humana'),
	production: text('Production', 'Producción'),
	'mix-master': text('Mix / Master', 'Mezcla / Master'),
	released: text('Released', 'Publicado'),
};
