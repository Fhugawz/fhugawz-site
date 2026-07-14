import { calculateResult, normalizeAnswers } from './scorecard-logic.js';
import { ownerEmail, visitorEmail } from './scorecard-emails.js';

const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
const dbHeaders = (key, prefer = 'return=minimal') => ({ apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: prefer });
const sendEmail = async (message, replyTo) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) throw new Error('Resend is not configured.');
  const payload = { from, to: message.to, subject: message.subject, html: message.html };
  if (replyTo) payload.reply_to = replyTo;
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error(`Resend failed: ${response.status}`);
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { success: false, message: 'Only POST requests are allowed.' });
  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const language = body.language === 'es' ? 'es' : 'en';
    const marketingConsent = body.marketingConsent === true;
    const token = String(body.submissionToken || '').trim();
    const answers = normalizeAnswers(body.answers);
    if (!isValidEmail(email) || !answers || token.length < 16 || token.length > 100) return json(400, { success: false, message: 'Invalid submission.' });

    const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase is not configured.');
    const result = calculateResult(answers);
    const scores = result.categoryScores;
    const row = { email, language, total_score: result.total, result_level: result.resultId, artist_identity_score: scores.artistIdentity, sonic_direction_score: scores.sonicDirection, visual_narrative_score: scores.visualNarrative, release_preparation_score: scores.releasePreparation, audience_content_score: scores.audienceContent, strongest_categories: result.strongest, weakest_categories: result.weakest, answers_json: answers, marketing_consent: marketingConsent, submission_token: token, user_agent: String(event.headers?.['user-agent'] || '').slice(0, 500) };
    const saved = await fetch(`${url}/rest/v1/scorecard_results`, { method: 'POST', headers: dbHeaders(key), body: JSON.stringify(row) });
    if (!saved.ok) {
      if (saved.status === 409) return json(200, { success: true, duplicate: true });
      throw new Error(`Supabase insert failed: ${saved.status}`);
    }

    if (marketingConsent) await fetch(`${url}/rest/v1/blog_subscribers?on_conflict=email`, { method: 'POST', headers: dbHeaders(key, 'resolution=merge-duplicates,return=minimal'), body: JSON.stringify({ email, language, status: 'active' }) });
    const visitor = visitorEmail(email, language, result);
    const owner = ownerEmail(email, language, result, marketingConsent);
    owner.to = process.env.CONTACT_NOTIFICATION_EMAIL;
    let emailSent = Boolean(owner.to);
    try { if (!owner.to) throw new Error('Notification recipient is missing.'); await Promise.all([sendEmail(visitor), sendEmail(owner, email)]); }
    catch (error) { emailSent = false; console.error('Scorecard email failed', error); }
    return json(200, { success: true, emailSent, result });
  } catch (error) {
    console.error('Scorecard submission failed', error);
    return json(500, { success: false, message: 'The result could not be saved.' });
  }
};
