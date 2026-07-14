import { calculateResult, normalizeAnswers } from './scorecard-logic.js';

const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const saveResult = async (row) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error('Supabase is not configured.');
  return fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/scorecard_results`, {
    method: 'POST',
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  });
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { success: false, message: 'Only POST requests are allowed.' });
  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const language = body.language === 'es' ? 'es' : 'en';
    const marketingConsent = body.marketingConsent === true;
    const submissionToken = String(body.submissionToken || '').trim();
    const answers = normalizeAnswers(body.answers);
    if (!isValidEmail(email) || !answers || submissionToken.length < 16 || submissionToken.length > 100) return json(400, { success: false, message: 'Invalid submission.' });
    const result = calculateResult(answers);
    const scores = result.categoryScores;
    const response = await saveResult({ email, language, total_score: result.total, result_level: result.resultId, artist_identity_score: scores.artistIdentity, sonic_direction_score: scores.sonicDirection, visual_narrative_score: scores.visualNarrative, release_preparation_score: scores.releasePreparation, audience_content_score: scores.audienceContent, strongest_categories: result.strongest, weakest_categories: result.weakest, answers_json: answers, marketing_consent: marketingConsent, submission_token: submissionToken, user_agent: String(event.headers?.['user-agent'] || '').slice(0, 500) });
    if (!response.ok) {
      if (response.status === 409) return json(200, { success: true, duplicate: true });
      throw new Error(`Supabase insert failed: ${response.status}`);
    }
    return json(200, { success: true, result });
  } catch (error) {
    console.error('Scorecard submission failed', error);
    return json(500, { success: false, message: 'The result could not be saved.' });
  }
};
