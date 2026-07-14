import { calculateScorecard, categoryIds, questionKey } from '../data/scorecard.js';
import { scorecardEn } from '../data/scorecard-en.js';
import { scorecardEs } from '../data/scorecard-es.js';

const contentByLanguage = { en: scorecardEn, es: scorecardEs };
const root = document.querySelector('[data-scorecard-app]');

if (root instanceof HTMLElement) {
	const screens = Object.fromEntries(
		['intro', 'questions', 'results'].map((name) => [name, root.querySelector(`[data-scorecard-screen="${name}"]`)]),
	);
	const form = root.querySelector('[data-scorecard-form]');
	const optionsContainer = root.querySelector('[data-scorecard-options]');
	const state = { answers: {}, index: 0 };
	const questions = categoryIds.flatMap((categoryId) =>
		[0, 1, 2, 3].map((questionIndex) => ({ categoryId, questionIndex, key: questionKey(categoryId, questionIndex) })),
	);

	const getLanguage = () => (document.documentElement.dataset.language === 'es' ? 'es' : 'en');
	const getContent = () => contentByLanguage[getLanguage()];
	const showScreen = (name) => {
		Object.entries(screens).forEach(([screenName, element]) => {
			if (element instanceof HTMLElement) element.hidden = screenName !== name;
		});
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	const setText = (selector, text) => {
		const element = root.querySelector(selector);
		if (element instanceof HTMLElement) element.textContent = text;
	};
	const track = (eventName, params = {}) => window.fhugawzTrackEvent?.(eventName, params);

	const renderIntro = () => {
		const { intro } = getContent();
		Object.entries(intro).forEach(([key, value]) => setText(`[data-scorecard-intro="${key}"]`, value));
	};

	const renderQuestion = () => {
		const content = getContent();
		const current = questions[state.index];
		const category = content.categories[current.categoryId];
		const savedValue = state.answers[current.key];
		setText('[data-scorecard-category-name]', category.name);
		setText('[data-scorecard-category-description]', category.description);
		setText('[data-scorecard-question]', category.questions[current.questionIndex]);
		setText('[data-scorecard-counter]', `${content.ui.question} ${state.index + 1} ${content.ui.of} ${questions.length}`);
		setText('[data-scorecard-previous]', content.ui.previous);
		setText('[data-scorecard-next]', state.index === questions.length - 1 ? content.ui.results : content.ui.next);
		const progress = root.querySelector('[data-scorecard-progress]');
		if (progress instanceof HTMLElement) progress.style.width = `${((state.index + 1) / questions.length) * 100}%`;
		const previous = root.querySelector('[data-scorecard-previous]');
		if (previous instanceof HTMLButtonElement) previous.disabled = state.index === 0;
		const error = root.querySelector('[data-scorecard-error]');
		if (error instanceof HTMLElement) { error.textContent = ''; error.hidden = true; }
		if (optionsContainer instanceof HTMLElement) {
			optionsContainer.innerHTML = '';
			content.scale.forEach((option) => {
				const label = document.createElement('label');
				label.className = 'scorecard-option';
				label.innerHTML = `<input type="radio" name="scorecard-answer" value="${option.value}" ${Number(savedValue) === option.value ? 'checked' : ''}><span class="scorecard-option-score">${option.value}</span><span><strong></strong><small></small></span>`;
				label.querySelector('strong').textContent = option.label;
				label.querySelector('small').textContent = option.detail;
				optionsContainer.append(label);
			});
		}
	};

	const renderResults = () => {
		const content = getContent();
		const result = calculateScorecard(state.answers);
		const range = content.results[result.resultId];
		setText('[data-scorecard-result-label]', content.ui.totalScore);
		setText('[data-scorecard-total]', String(result.total));
		setText('[data-scorecard-result-title]', range.title);
		setText('[data-scorecard-result-diagnosis]', range.diagnosis);
		setText('[data-scorecard-result-priority]', range.priority);
		setText('[data-scorecard-category-heading]', content.ui.categoryScores);
		setText('[data-scorecard-strongest-label]', content.ui.strongest);
		setText('[data-scorecard-weakest-label]', content.ui.weakest);
		setText('[data-scorecard-strongest]', result.strongest.map((id) => content.categories[id].name).join(', '));
		setText('[data-scorecard-weakest]', result.weakest.map((id) => content.categories[id].name).join(', '));
		setText('[data-scorecard-next-steps-heading]', content.ui.nextSteps);
		setText('[data-scorecard-recommendation-heading]', content.ui.recommendation);
		setText('[data-scorecard-recommendation]', result.weakest.map((id) => content.recommendations[id]).join(' '));
		setText('[data-scorecard-restart]', content.ui.restart);

		const categoryResults = root.querySelector('[data-scorecard-category-results]');
		if (categoryResults instanceof HTMLElement) {
			categoryResults.innerHTML = '';
			categoryIds.forEach((id) => {
				const row = document.createElement('div');
				row.className = 'scorecard-category-row';
				const name = document.createElement('span');
				name.textContent = content.categories[id].name;
				const score = document.createElement('strong');
				score.textContent = `${result.categoryScores[id]}/16`;
				row.append(name, score);
				categoryResults.append(row);
			});
		}

		const nextSteps = root.querySelector('[data-scorecard-next-steps]');
		if (nextSteps instanceof HTMLOListElement) {
			nextSteps.innerHTML = '';
			const actions = result.weakest.flatMap((id) => content.actions[id]).slice(0, 3);
			actions.forEach((action) => {
				const item = document.createElement('li');
				item.textContent = action;
				nextSteps.append(item);
			});
		}
		track('scorecard_completed', { score: result.total, result_level: result.resultId });
	};

	root.querySelector('[data-scorecard-start]')?.addEventListener('click', () => {
		showScreen('questions');
		renderQuestion();
		track('scorecard_started');
	});

	root.querySelector('[data-scorecard-previous]')?.addEventListener('click', () => {
		if (state.index > 0) { state.index -= 1; renderQuestion(); }
	});

	if (form instanceof HTMLFormElement) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const selected = form.querySelector('input[name="scorecard-answer"]:checked');
			const error = root.querySelector('[data-scorecard-error]');
			if (!(selected instanceof HTMLInputElement)) {
				if (error instanceof HTMLElement) { error.textContent = getContent().ui.answerRequired; error.hidden = false; }
				return;
			}
			state.answers[questions[state.index].key] = Number(selected.value);
			if (state.index === questions.length - 1) {
				renderResults();
				showScreen('results');
				return;
			}
			const completedCategory = questions[state.index].questionIndex === 3;
			if (completedCategory) track('scorecard_category_completed', { category: questions[state.index].categoryId });
			state.index += 1;
			renderQuestion();
		});
	}

	root.querySelector('[data-scorecard-restart]')?.addEventListener('click', () => {
		state.answers = {};
		state.index = 0;
		renderIntro();
		showScreen('intro');
		track('scorecard_restarted');
	});

	window.addEventListener('fhugawz:languagechange', () => {
		renderIntro();
		if (!screens.questions?.hidden) renderQuestion();
		if (!screens.results?.hidden) renderResults();
	});

	renderIntro();
	track('scorecard_viewed');
}
