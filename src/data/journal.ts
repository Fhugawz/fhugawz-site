import type { LocalizedText } from '../types/world';

const text = (en: string, es: string): LocalizedText => ({ en, es });

export type JournalEntry = {
	slug: string;
	href: string;
	date: string;
	selected: boolean;
	category: LocalizedText;
	title: LocalizedText;
	excerpt: LocalizedText;
	image: string;
	alt: LocalizedText;
};

export const journalEntries: JournalEntry[] = [
	{
		slug: 'building-axioms',
		href: '/blog/building-axioms',
		date: '2026-06-27',
		selected: true,
		category: text('World notes', 'Notas de mundo'),
		title: text('Building the Sequence', 'Construyendo la secuencia'),
		excerpt: text(
			'Notes on how thirteen separate Worlds gradually became one connected cycle, and the structure I am still discovering while I build it.',
			'Notas sobre cómo trece Mundos separados se convirtieron gradualmente en un ciclo conectado y la estructura que sigo descubriendo mientras la construyo.'
		),
		image: '/images/blog/building-axioms/building-axioms-dark-pop-origin-hero.webp.webp',
		alt: text('Fhugawz working on the connected sequence of thirteen musical Worlds.', 'Fhugawz trabajando en la secuencia conectada de trece Mundos musicales.'),
	},
	{
		slug: 'why-fhugawz-exists',
		href: '/blog/why-fhugawz-exists',
		date: '2026-06-27',
		selected: true,
		category: text('Origins', 'Orígenes'),
		title: text('Why Fhugawz Exists', 'Por qué existe Fhugawz'),
		excerpt: text(
			'A personal note on music, design, recovery and the long process of giving scattered influences one direction.',
			'Una nota personal sobre música, diseño, recuperación y el largo proceso de dar una sola dirección a influencias dispersas.'
		),
		image: '/images/blog/why-fhugawz-exists/why-fhugawz-exists-classical-guitar-bands.webp',
		alt: text('Early musical origins behind the Fhugawz narrative project.', 'Orígenes musicales tempranos detrás del proyecto narrativo Fhugawz.'),
	},
	{
		slug: 'sound-of-reconstruction',
		href: '/blog/sound-of-reconstruction',
		date: '2026-06-27',
		selected: true,
		category: text('Process', 'Proceso'),
		title: text('The Sound of Reconstruction', 'El sonido de la reconstrucción'),
		excerpt: text(
			'Where an AI assisted sketch ends and human arrangement, performance and production begin.',
			'Donde termina un boceto asistido con IA y comienzan el arreglo, la interpretación y la producción humana.'
		),
		image: '/images/blog/sound-of-reconstruction/sound-of-reconstruction-demo-recreation-hero.webp.webp',
		alt: text('Music reconstruction process within the Fhugawz project.', 'Proceso de reconstrucción musical dentro del proyecto Fhugawz.'),
	},
	{
		slug: 'every-album-is-an-era',
		href: '/blog/every-album-is-an-era',
		date: '2026-06-27',
		selected: false,
		category: text('World building', 'Construcción de mundos'),
		title: text('Building an Independent Artist World', 'Construir un universo artístico independiente'),
		excerpt: text(
			'How music, visual identity, story and release structure can become one recognizable world.',
			'Cómo la música, la identidad visual, la historia y la estructura de lanzamiento pueden convertirse en un mundo reconocible.'
		),
		image: '/images/blog/building-an-independent-artist-world/building-independent-artist-world-hero.webp.webp',
		alt: text('Visual identity and narrative planning for an independent music world.', 'Identidad visual y planificación narrativa para un mundo musical independiente.'),
	},
	{
		slug: 'dark-visuals-make-music-memorable',
		href: '/blog/dark-visuals-make-music-memorable',
		date: '2026-07-09',
		selected: false,
		category: text('Visual direction', 'Dirección visual'),
		title: text('When a World Starts to Take Shape', 'Cuando un Mundo empieza a tomar forma'),
		excerpt: text(
			'Notes on how the visual identity of each World is helping me understand the music, the sequence and what actually belongs inside each part of Fhugawz.',
			'Notas sobre cómo la identidad visual de cada Mundo me ayuda a entender la música, la secuencia y lo que realmente pertenece dentro de cada parte de Fhugawz.'
		),
		image: '/images/blog/blog-dark-visuals-music-memory-fhugawz-resources.webp.webp',
		alt: text('Fhugawz observing a nocturnal scene while developing the visual identity of the Worlds.', 'Fhugawz observando una escena nocturna mientras desarrolla la identidad visual de los Mundos.'),
	},
	{
		slug: 'songs-need-more-than-production',
		href: '/blog/songs-need-more-than-production',
		date: '2026-07-09',
		selected: false,
		category: text('Creative direction', 'Dirección creativa'),
		title: text('When a Song Finds Its Place', 'Cuando una canción encuentra su lugar'),
		excerpt: text(
			'Notes on what happens when a song works on its own but still has not found the right place inside the larger sequence.',
			'Notas sobre lo que ocurre cuando una canción funciona por sí sola, pero todavía no ha encontrado el lugar correcto dentro de la secuencia más amplia.'
		),
		image: '/images/blog/blog-from-demo-to-direction-music-production-fhugawz.webp.webp',
		alt: text('A solitary figure considering where a song belongs inside the larger Fhugawz sequence.', 'Una figura solitaria pensando dónde pertenece una canción dentro de la secuencia más amplia de Fhugawz.'),
	},
];

export const selectedJournalEntries = journalEntries.filter((entry) => entry.selected).slice(0, 3);

export const journalEntriesPerPage = 13;
export const orderedJournalEntries = [...journalEntries].sort(
	(a, b) => Date.parse(b.date) - Date.parse(a.date)
);
export const journalPageCount = Math.max(1, Math.ceil(orderedJournalEntries.length / journalEntriesPerPage));

export function getJournalPageEntries(page: number) {
	if (page === 1) {
		return {
			featuredEntry: orderedJournalEntries[0],
			secondaryEntries: orderedJournalEntries.slice(1, journalEntriesPerPage),
		};
	}

	const start = (page - 1) * journalEntriesPerPage;
	return {
		featuredEntry: undefined,
		secondaryEntries: orderedJournalEntries.slice(start, start + journalEntriesPerPage),
	};
}
