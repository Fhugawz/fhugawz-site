import type { Language, LocalizedText } from '../types/world';

export const defaultLanguage: Language = 'en';

export function localize(value: LocalizedText, language: Language): string {
	return value[language];
}

export function localizedTextAttributes(value: LocalizedText): Record<string, string> {
	return {
		'data-artist-en': value.en,
		'data-artist-es': value.es,
	};
}

export function localizedAltAttributes(value: LocalizedText): Record<string, string> {
	return {
		'data-artist-alt-en': value.en,
		'data-artist-alt-es': value.es,
	};
}

export function localizedAriaAttributes(value: LocalizedText): Record<string, string> {
	return {
		'data-artist-aria-en': value.en,
		'data-artist-aria-es': value.es,
	};
}

export function appendLocalized(value: LocalizedText, suffix: string): LocalizedText {
	return {
		en: `${value.en}${suffix}`,
		es: `${value.es}${suffix}`,
	};
}

export function getDocumentLanguage(): Language {
	return document.documentElement.dataset.language === 'es' || document.documentElement.lang === 'es'
		? 'es'
		: 'en';
}

export function applyArtistLanguage(language: Language, root: ParentNode = document): void {
	root.querySelectorAll<HTMLElement>('[data-artist-en][data-artist-es]').forEach((element) => {
		element.textContent = language === 'es' ? element.dataset.artistEs || '' : element.dataset.artistEn || '';
	});

	root.querySelectorAll<HTMLImageElement>('[data-artist-alt-en][data-artist-alt-es]').forEach((image) => {
		image.alt = language === 'es' ? image.dataset.artistAltEs || '' : image.dataset.artistAltEn || '';
	});

	root.querySelectorAll<HTMLElement>('[data-artist-aria-en][data-artist-aria-es]').forEach((element) => {
		const label = language === 'es' ? element.dataset.artistAriaEs || '' : element.dataset.artistAriaEn || '';
		element.setAttribute('aria-label', label);
	});
}
