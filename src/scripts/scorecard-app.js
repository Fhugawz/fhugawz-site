import { calculateScorecard, categoryIds, questionKey } from '../data/scorecard.js';
import { scorecardEn } from '../data/scorecard-en.js';
import { scorecardEs } from '../data/scorecard-es.js';

const contentByLanguage = { en: scorecardEn, es: scorecardEs };
const captureCopy = {
  en: {
    privacy: 'Your answers stay in this browser until you choose to send them. Email is requested only after the diagnosis.',
    heading: 'Send your diagnosis to Fhugawz Studio',
    copy: 'Enter your email to receive a copy of the result and send the complete diagnosis to Fhugawz Studio. This gives us useful context if you decide to continue the conversation.',
    placeholder: 'your@email.com',
    submit: 'SEND MY RESULTS',
    consent: 'Also send me occasional Fhugawz Studio resources and project updates. No spam. You can unsubscribe at any time.',
    studio: 'EXPLORE FHUGAWZ STUDIO',
    required: 'Enter a valid email address.',
    sending: 'Sending your results...',
    success: 'Results sent. Check your inbox for the confirmation.',
    partial: 'Your diagnosis was saved, but the confirmation email could not be delivered right now.',
    error: 'The results could not be sent. Please try again.',
  },
  es: {
    privacy: 'Tus respuestas permanecen en este navegador hasta que decidas enviarlas. El correo se solicita únicamente después del diagnóstico.',
    heading: 'Envía tu diagnóstico a Fhugawz Studio',
    copy: 'Ingresa tu correo para recibir una copia del resultado y enviar el diagnóstico completo a Fhugawz Studio. Así tendremos contexto útil si decides continuar la conversación.',
    placeholder: 'tu@email.com',
    submit: 'ENVIAR MIS RESULTADOS',
    consent: 'También quiero recibir ocasionalmente recursos y novedades de Fhugawz Studio. Sin spam. Puedo cancelar la suscripción cuando quiera.',
    studio: 'EXPLORAR FHUGAWZ STUDIO',
    required: 'Ingresa un correo válido.',
    sending: 'Enviando tus resultados...',
    success: 'Resultados enviados. Revisa tu correo para ver la confirmación.',
    partial: 'El diagnóstico fue guardado, pero el correo de confirmación no pudo entregarse ahora.',
    error: 'No se pudieron enviar los resultados. Inténtalo de nuevo.',
  },
};

const root = document.querySelector('[data-scorecard-app]');
if (root instanceof HTMLElement) {
  const screens = Object.fromEntries(['intro', 'questions', 'results'].map((name) => [name, root.querySelector(`[data-scorecard-screen="${name}"]`)]));
  const form = root.querySelector('[data-scorecard-form]');
  const captureForm = root.querySelector('[data-scorecard-capture-form]');
  const optionsContainer = root.querySelector('[data-scorecard-options]');
  const state = { answers: {}, index: 0, completed: false, result: null, token: crypto.randomUUID() };
  const questions = categoryIds.flatMap((categoryId) => [0, 1, 2, 3].map((questionIndex) => ({ categoryId, questionIndex, key: questionKey(categoryId, questionIndex) })));
  const getLanguage = () => (document.documentElement.dataset.language === 'es' ? 'es' : 'en');
  const getContent = () => contentByLanguage[getLanguage()];
  const getCapture = () => captureCopy[getLanguage()];
  const track = (eventName, params = {}) => window.fhugawzTrackEvent?.(eventName, params);
  const setText = (selector, text) => { const element = root.querySelector(selector); if (element instanceof HTMLElement) element.textContent = text; };
  const showScreen = (name) => {
    Object.entries(screens).forEach(([screenName, element]) => { if (element instanceof HTMLElement) element.hidden = screenName !== name; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const setSubmitStatus = (message = '', stateName = '') => {
    const element = root.querySelector('[data-scorecard-submit-status]');
    if (!(element instanceof HTMLElement)) return;
    element.textContent = message;
    element.hidden = !message;
    if (stateName) element.dataset.state = stateName; else delete element.dataset.state;
  };

  const renderIntro = () => {
    const { intro } = getContent();
    setText('[data-scorecard-intro="kicker"]', intro.kicker);
    setText('[data-scorecard-intro="title"]', intro.title);
    setText('[data-scorecard-intro="body"]', intro.body);
    setText('[data-scorecard-intro="privacy"]', getCapture().privacy);
    setText('[data-scorecard-start]', intro.start);
    const labels = getLanguage() === 'es' ? ['20 preguntas', '5 áreas', '5–8 min'] : ['20 questions', '5 areas', '5–8 min'];
    root.querySelectorAll('.scorecard-meta span').forEach((element, index) => { element.textContent = labels[index] || ''; });
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
        label.innerHTML = `<input type="radio" name="scorecard-answer" value="${option.value}" ${Number(savedValue) === option.value ? 'checked' : ''}><span class="scorecard-option-score" aria-hidden="true">${option.value}</span><span class="scorecard-option-copy"><strong></strong><small></small></span>`;
        label.querySelector('strong').textContent = `${option.value} — ${option.label}`;
        label.querySelector('small').textContent = option.detail;
        optionsContainer.append(label);
      });
    }
  };

  const renderResults = ({ trackView = false } = {}) => {
    const content = getContent();
    const result = calculateScorecard(state.answers);
    state.result = result;
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
    const capture = getCapture();
    setText('[data-scorecard-capture-heading]', capture.heading);
    setText('[data-scorecard-capture-copy]', capture.copy);
    setText('[data-scorecard-submit-results]', capture.submit);
    setText('[data-scorecard-consent-copy]', capture.consent);
    setText('[data-scorecard-studio-link]', capture.studio);
    const email = root.querySelector('[data-scorecard-email]');
    if (email instanceof HTMLInputElement) email.placeholder = capture.placeholder;

    const categoryResults = root.querySelector('[data-scorecard-category-results]');
    if (categoryResults instanceof HTMLElement) {
      categoryResults.innerHTML = '';
      categoryIds.forEach((id) => {
        const row = document.createElement('div'); row.className = 'scorecard-category-row';
        const name = document.createElement('span'); name.textContent = content.categories[id].name;
        const score = document.createElement('strong'); score.textContent = `${result.categoryScores[id]}/16`;
        row.append(name, score); categoryResults.append(row);
      });
    }
    const nextSteps = root.querySelector('[data-scorecard-next-steps]');
    if (nextSteps instanceof HTMLOListElement) {
      nextSteps.innerHTML = '';
      result.weakest.flatMap((id) => content.actions[id]).slice(0, 3).forEach((action) => { const item = document.createElement('li'); item.textContent = action; nextSteps.append(item); });
    }
    if (trackView) {
      track('scorecard_completed', { score: result.total, result_level: result.resultId });
      track('scorecard_result_viewed', { result_level: result.resultId });
    }
  };

  root.querySelector('[data-scorecard-start]')?.addEventListener('click', () => { showScreen('questions'); renderQuestion(); track('scorecard_started'); });
  root.querySelector('[data-scorecard-previous]')?.addEventListener('click', () => { if (state.index > 0) { state.index -= 1; renderQuestion(); } });
  if (form instanceof HTMLFormElement) form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="scorecard-answer"]:checked');
    const error = root.querySelector('[data-scorecard-error]');
    if (!(selected instanceof HTMLInputElement)) { if (error instanceof HTMLElement) { error.textContent = getContent().ui.answerRequired; error.hidden = false; } return; }
    state.answers[questions[state.index].key] = Number(selected.value);
    if (state.index === questions.length - 1) { state.completed = true; renderResults({ trackView: true }); showScreen('results'); return; }
    if (questions[state.index].questionIndex === 3) track('scorecard_category_completed', { category: questions[state.index].categoryId });
    state.index += 1; renderQuestion();
  });

  if (captureForm instanceof HTMLFormElement) captureForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const copy = getCapture();
    const emailInput = captureForm.elements.namedItem('email');
    const consentInput = captureForm.elements.namedItem('marketingConsent');
    const submitButton = root.querySelector('[data-scorecard-submit-results]');
    const email = emailInput instanceof HTMLInputElement ? emailInput.value.trim() : '';
    if (!(emailInput instanceof HTMLInputElement) || !emailInput.validity.valid || !email) { setSubmitStatus(copy.required, 'error'); emailInput?.focus(); return; }
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
    setSubmitStatus(copy.sending);
    try {
      const response = await fetch('/.netlify/functions/scorecard-submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, language: getLanguage(), marketingConsent: consentInput instanceof HTMLInputElement && consentInput.checked, answers: state.answers, submissionToken: state.token }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error('Submission failed');
      setSubmitStatus(data.emailSent === false ? copy.partial : copy.success, data.emailSent === false ? 'error' : 'success');
      track('scorecard_results_submitted', { result_level: state.result?.resultId, marketing_consent: consentInput instanceof HTMLInputElement && consentInput.checked });
    } catch { setSubmitStatus(copy.error, 'error'); }
    finally { if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false; }
  });

  root.querySelector('[data-scorecard-studio-link]')?.addEventListener('click', () => track('scorecard_cta_clicked'));
  root.querySelector('[data-scorecard-restart]')?.addEventListener('click', () => {
    state.answers = {}; state.index = 0; state.completed = false; state.result = null; state.token = crypto.randomUUID();
    if (captureForm instanceof HTMLFormElement) captureForm.reset(); setSubmitStatus(); renderIntro(); showScreen('intro'); track('scorecard_restarted');
  });
  window.addEventListener('fhugawz:languagechange', () => { renderIntro(); if (!screens.questions?.hidden) renderQuestion(); if (!screens.results?.hidden && state.completed) renderResults(); });
  renderIntro(); track('scorecard_viewed');
}
