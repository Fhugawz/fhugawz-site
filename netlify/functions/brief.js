import { createHash } from 'node:crypto';
import { valueToDisplayText } from './display-labels.js';

const json = (statusCode, body) => ({
	statusCode,
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(body),
});

const serviceMeta = {
	general: { label: 'General Project Brief', subjectPrefix: '[GEN] New Lead' },
	demo_reconstruction: { label: 'Demo Reconstruction', subjectPrefix: '[DR] New Lead' },
	music_production: { label: 'Music Production', subjectPrefix: '[MP] New Lead' },
	mixing_mastering: { label: 'Mixing / Mastering', subjectPrefix: '[MM] New Lead' },
	artist_world_building: { label: 'Artist World Building', subjectPrefix: '[WB] New Lead' },
};

const commonFields = [
	'name', 'artist_name', 'email', 'country_city', 'preferred_contact', 'project_stage',
	'main_problem', 'reference_links', 'material_links', 'deadline', 'level_of_support',
	'desired_outcome', 'additional_notes', 'newsletter_consent',
];

const maxLengths = {
	name: 120, artist_name: 160, email: 254, country_city: 160, preferred_contact: 80,
	project_stage: 3000, main_problem: 3000, reference_links: 3000, material_links: 3000,
	deadline: 160, level_of_support: 120, desired_outcome: 3000, additional_notes: 3000,
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isTooFast = (startedAt) => {
	const submittedAt = Number(startedAt);
	return Number.isFinite(submittedAt) && Date.now() - submittedAt < 1200;
};
const hasObviousSpam = (value) => {
	const text = String(value || '').toLowerCase();
	const urls = text.match(/https?:\/\/|www\./g) || [];
	return urls.length > 8 || /<\/?[a-z][\s\S]*>/i.test(text) || /\b(viagra|casino|crypto giveaway|seo services|telegram spam)\b/i.test(text);
};
const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (character) => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));
const normalizeValue = (value) => {
	if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
	if (typeof value === 'boolean') return value;
	return String(value || '').trim();
};
const valueToText = (value) => {
	if (Array.isArray(value)) return value.join(', ');
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (value && typeof value === 'object') return JSON.stringify(value);
	return String(value || '');
};
const getString = (body, key) => valueToText(normalizeValue(body[key])).trim();
const getProcessEnv = (name) => String(process.env[name] || '').trim();
const formatSender = (email) => {
	const fallback = 'contact@fhugawz.com';
	const raw = String(email || fallback).trim();
	const emailAddress = raw.match(/<([^>]+)>/)?.[1] || raw || fallback;
	return `Fhugawz Studio <${emailAddress}>`;
};

const supabaseConfig = () => {
	const url = getProcessEnv('SUPABASE_URL').replace(/\/$/, '');
	const key = getProcessEnv('SUPABASE_SERVICE_ROLE_KEY');
	if (!url || !key) throw new Error('Supabase environment variables are not configured.');
	return { url, key };
};
const supabaseHeaders = (key, prefer) => ({
	apikey: key,
	Authorization: `Bearer ${key}`,
	'Content-Type': 'application/json',
	...(prefer ? { Prefer: prefer } : {}),
});
const readResponseError = async (response) => {
	const text = await response.text().catch(() => '');
	if (!text) return `${response.status} ${response.statusText}`.trim();
	try { return JSON.stringify(JSON.parse(text)); } catch { return text; }
};

const createFingerprint = ({ serviceType, email, briefData }) => createHash('sha256')
	.update(JSON.stringify({ serviceType, email, briefData }))
	.digest('hex');

const findRecentDuplicate = async (fingerprint) => {
	const { url, key } = supabaseConfig();
	const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
	const query = new URLSearchParams({
		select: 'id,created_at,notification_status',
		submission_fingerprint: `eq.${fingerprint}`,
		created_at: `gte.${since}`,
		order: 'created_at.desc',
		limit: '1',
	});
	const response = await fetch(`${url}/rest/v1/lead_briefs?${query}`, { headers: supabaseHeaders(key) });
	if (!response.ok) throw new Error(`Duplicate lookup failed: ${await readResponseError(response)}`);
	const rows = await response.json();
	return Array.isArray(rows) ? rows[0] : null;
};

const insertBrief = async (row) => {
	const { url, key } = supabaseConfig();
	const response = await fetch(`${url}/rest/v1/lead_briefs`, {
		method: 'POST', headers: supabaseHeaders(key, 'return=representation'), body: JSON.stringify(row),
	});
	if (!response.ok) throw new Error(`Brief insert failed: ${await readResponseError(response)}`);
	const rows = await response.json();
	return Array.isArray(rows) ? rows[0] : null;
};

const updateNotificationState = async (id, patch) => {
	if (!id) return;
	const { url, key } = supabaseConfig();
	const response = await fetch(`${url}/rest/v1/lead_briefs?id=eq.${encodeURIComponent(id)}`, {
		method: 'PATCH', headers: supabaseHeaders(key, 'return=minimal'), body: JSON.stringify(patch),
	});
	if (!response.ok) console.error('notification state update failed', await readResponseError(response));
};

const renderBriefRows = (briefData) => Object.entries(briefData)
	.filter(([key]) => !['honeypot', 'started_at'].includes(key))
	.map(([key, value]) => `<tr><td style="padding:0 0 14px 0;"><p style="margin:0 0 5px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">${escapeHtml(key.replace(/_/g, ' '))}</p><p style="margin:0;color:#EFE4CC;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(valueToDisplayText(key, value))}</p></td></tr>`)
	.join('');

const sendBriefNotification = async ({ row, briefData, createdAt, briefId }) => {
	const apiKey = getProcessEnv('RESEND_API_KEY');
	const to = getProcessEnv('CONTACT_NOTIFICATION_EMAIL');
	if (!apiKey) throw new Error('RESEND_API_KEY is missing');
	if (!to) throw new Error('CONTACT_NOTIFICATION_EMAIL is missing');
	const from = getProcessEnv('CONTACT_FROM_EMAIL') || 'contact@fhugawz.com';
	const meta = serviceMeta[row.service_type] || serviceMeta.general;
	const subject = `${meta.subjectPrefix} — ${meta.label} — ${row.name || 'Unknown'}`;
	const text = [subject, '', `Brief ID: ${briefId || 'Unavailable'}`, `Service: ${meta.label}`, `Name: ${row.name}`, `Artist / Project: ${row.artist_name || 'Not provided'}`, `Email: ${row.email}`, `Created at: ${createdAt}`, '', ...Object.entries(briefData).map(([key, value]) => `${key}: ${valueToDisplayText(key, value)}`)].join('\n');
	const html = `<div style="margin:0;padding:28px 14px;background:#0B0F0B;color:#EFE4CC;font-family:Arial,Helvetica,sans-serif;"><div style="max-width:680px;margin:auto;background:#10160F;border:1px solid rgba(239,228,204,.18);border-radius:10px;padding:26px;"><p style="color:#FF5A1F;font-size:12px;font-weight:700;letter-spacing:2px;">FHUGAWZ STUDIO</p><h1 style="font-size:28px;">${escapeHtml(meta.label)}</h1><p>Brief ID: ${escapeHtml(briefId || 'Unavailable')}</p><p>A new lead brief was saved in Supabase.</p><table role="presentation" width="100%">${renderBriefRows(briefData)}</table></div></div>`;
	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ from: formatSender(from), to, subject, text, html, reply_to: row.email }),
	});
	if (!response.ok) throw new Error(`Resend notification failed: ${await readResponseError(response)}`);
};

export const handler = async (event) => {
	if (event.httpMethod !== 'POST') return json(405, { success: false, message: 'Only POST requests are allowed.' });
	try {
		const body = JSON.parse(event.body || '{}');
		const service_type = getString(body, 'service_type');
		const name = getString(body, 'name');
		const email = getString(body, 'email').toLowerCase();
		if (getString(body, 'honeypot')) return json(200, { success: true, message: 'Brief received. Thank you.' });
		if (isTooFast(body.started_at)) return json(400, { success: false, message: 'Please take a moment before sending.' });
		if (!serviceMeta[service_type]) return json(400, { success: false, message: 'Please choose a valid brief type.' });
		if (!name || !email) return json(400, { success: false, message: 'Please add your name and email before sending.' });
		if (!isValidEmail(email)) return json(400, { success: false, message: 'Please enter a valid email address.' });

		const briefData = {};
		Object.entries(body.brief_data && typeof body.brief_data === 'object' ? body.brief_data : body).forEach(([key, value]) => {
			if (!['honeypot', 'started_at'].includes(key)) briefData[key] = normalizeValue(value);
		});
		briefData.service_type = service_type;
		briefData.email = email;
		briefData.name = name;
		if (hasObviousSpam(JSON.stringify(briefData))) return json(400, { success: false, message: 'This brief could not be accepted.' });

		const row = { service_type, source: 'website', status: 'new', brief_data: briefData, notification_status: 'pending' };
		commonFields.forEach((field) => {
			if (field === 'newsletter_consent') { row[field] = body[field] === true || briefData[field] === true; return; }
			const value = field === 'reference_links'
				? getString(body, 'reference_links') || getString(body, 'references') || valueToText(briefData.reference_links).trim() || valueToText(briefData.references).trim()
				: getString(body, field) || valueToText(briefData[field]).trim();
			if (maxLengths[field] && value.length > maxLengths[field]) throw new Error(`Field too long: ${field}`);
			row[field] = value || null;
		});
		if (!row.main_problem && Array.isArray(briefData.main_concerns)) row.main_problem = briefData.main_concerns.join(', ');

		row.submission_fingerprint = createFingerprint({ serviceType: service_type, email, briefData });
		const duplicate = await findRecentDuplicate(row.submission_fingerprint);
		if (duplicate) return json(200, { success: true, duplicate: true, message: 'This brief was already received. No duplicate was created.' });

		const inserted = await insertBrief(row);
		try {
			await sendBriefNotification({ row, briefData, createdAt: inserted?.created_at || new Date().toISOString(), briefId: inserted?.id });
			await updateNotificationState(inserted?.id, { notification_status: 'sent', notification_error: null, notified_at: new Date().toISOString() });
		} catch (notificationError) {
			const message = notificationError instanceof Error ? notificationError.message : String(notificationError);
			console.error('brief notification failed', message);
			await updateNotificationState(inserted?.id, { notification_status: 'failed', notification_error: message.slice(0, 3000), notified_at: null });
		}
		return json(200, { success: true, brief_id: inserted?.id, message: 'Brief sent. Thank you for sharing the project.' });
	} catch (error) {
		console.error('brief function error', error);
		const message = error instanceof Error && error.message.startsWith('Field too long') ? 'Some fields are too long. Please shorten the brief and try again.' : 'The brief could not be sent right now. Please try again soon.';
		return json(500, { success: false, message });
	}
};
