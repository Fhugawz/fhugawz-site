const json = (statusCode, body) => ({
	statusCode,
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(body),
});

const serviceMeta = {
	general: {
		label: 'General Project Brief',
		subjectPrefix: '[GEN] New Lead',
	},
	demo_reconstruction: {
		label: 'Demo Reconstruction',
		subjectPrefix: '[DR] New Lead',
	},
	music_production: {
		label: 'Music Production',
		subjectPrefix: '[MP] New Lead',
	},
	mixing_mastering: {
		label: 'Mixing / Mastering',
		subjectPrefix: '[MM] New Lead',
	},
	artist_world_building: {
		label: 'Artist World Building',
		subjectPrefix: '[WB] New Lead',
	},
};

const commonFields = [
	'name',
	'artist_name',
	'email',
	'country_city',
	'preferred_contact',
	'project_stage',
	'main_problem',
	'reference_links',
	'material_links',
	'deadline',
	'level_of_support',
	'desired_outcome',
	'additional_notes',
	'newsletter_consent',
];

const maxLengths = {
	name: 120,
	artist_name: 160,
	email: 254,
	country_city: 160,
	preferred_contact: 80,
	project_stage: 3000,
	main_problem: 3000,
	reference_links: 3000,
	material_links: 3000,
	deadline: 160,
	level_of_support: 120,
	desired_outcome: 3000,
	additional_notes: 3000,
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isTooFast = (startedAt) => {
	const submittedAt = Number(startedAt);
	return Number.isFinite(submittedAt) && Date.now() - submittedAt < 1200;
};

const hasObviousSpam = (value) => {
	const text = String(value || '').toLowerCase();
	const urls = text.match(/https?:\/\/|www\./g) || [];
	return (
		urls.length > 8 ||
		/<\/?[a-z][\s\S]*>/i.test(text) ||
		/\b(viagra|casino|crypto giveaway|seo services|telegram spam)\b/i.test(text)
	);
};

const escapeHtml = (value) =>
	String(value || '').replace(/[&<>"']/g, (character) => {
		const entities = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
		};

		return entities[character];
	});

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

const formatSender = (email) => {
	const fallback = 'contact@fhugawz.com';
	const raw = String(email || fallback).trim();
	const emailAddress = raw.match(/<([^>]+)>/)?.[1] || raw || fallback;
	return `FHUGAWZ Studio <${emailAddress}>`;
};

const getProcessEnv = (name) => String(process.env[name] || '').trim();

const logEnvPresence = () => {
	console.info('brief env presence', {
		SUPABASE_URL: Boolean(getProcessEnv('SUPABASE_URL')),
		SUPABASE_SERVICE_ROLE_KEY: Boolean(getProcessEnv('SUPABASE_SERVICE_ROLE_KEY')),
		RESEND_API_KEY: Boolean(getProcessEnv('RESEND_API_KEY')),
		CONTACT_NOTIFICATION_EMAIL: Boolean(getProcessEnv('CONTACT_NOTIFICATION_EMAIL')),
		CONTACT_FROM_EMAIL: Boolean(getProcessEnv('CONTACT_FROM_EMAIL')),
	});
};

const insertRow = async (table, row) => {
	const supabaseUrl = getProcessEnv('SUPABASE_URL');
	const serviceRoleKey = getProcessEnv('SUPABASE_SERVICE_ROLE_KEY');

	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error(
			`Supabase environment variables are not configured. SUPABASE_URL=${supabaseUrl ? 'set' : 'missing'}, SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey ? 'set' : 'missing'}`
		);
	}

	return fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}`, {
		method: 'POST',
		headers: {
			apikey: serviceRoleKey,
			Authorization: `Bearer ${serviceRoleKey}`,
			'Content-Type': 'application/json',
			Prefer: 'return=representation',
		},
		body: JSON.stringify(row),
	});
};

const readResponseError = async (response) => {
	const text = await response.text().catch(() => '');
	if (!text) return `${response.status} ${response.statusText}`.trim();

	try {
		return JSON.stringify(JSON.parse(text));
	} catch {
		return text;
	}
};

const renderBriefRows = (briefData) =>
	Object.entries(briefData)
		.filter(([key]) => !['honeypot', 'started_at'].includes(key))
		.map(([key, value]) => {
			const label = key.replace(/_/g, ' ');
			return `
				<tr>
					<td style="padding:0 0 14px 0;">
						<p style="margin:0 0 5px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">${escapeHtml(label)}</p>
						<p style="margin:0;color:#EFE4CC;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(valueToText(value))}</p>
					</td>
				</tr>
			`;
		})
		.join('');

const sendBriefNotification = async ({ row, briefData, created_at }) => {
	const apiKey = getProcessEnv('RESEND_API_KEY');
	if (!apiKey) return;

	const to = getProcessEnv('CONTACT_NOTIFICATION_EMAIL');
	if (!to) {
		console.error('brief notification skipped: CONTACT_NOTIFICATION_EMAIL is missing');
		return;
	}

	const from = getProcessEnv('CONTACT_FROM_EMAIL') || 'contact@fhugawz.com';
	const meta = serviceMeta[row.service_type] || serviceMeta.general;
	const name = row.name || 'Unknown';
	const subject = `${meta.subjectPrefix} \u2014 ${meta.label} \u2014 ${name}`;
	const createdAt = created_at || new Date().toISOString();
	const preheader = `A new ${meta.label} was saved in Supabase.`;
	const logoUrl = 'https://fhugawz.com/images/brand/fhugawz-full-logo-transparent-light.svg';
	const headerImageUrl = 'https://fhugawz.com/images/hero/fhugawz-cinematic-dark-pop-hero.webp';
	const text = [
		subject,
		'',
		`Service: ${meta.label}`,
		`Name: ${row.name}`,
		`Artist / Project: ${row.artist_name || 'Not provided'}`,
		`Email: ${row.email}`,
		`Created at: ${createdAt}`,
		'',
		...Object.entries(briefData).map(([key, value]) => `${key}: ${valueToText(value)}`),
	].join('\n');
	const html = `
		<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px;font-size:1px;mso-hide:all;">
			${escapeHtml(preheader)}
		</div>
		<div style="margin:0;padding:0;background:#0B0F0B;color:#EFE4CC;font-family:Arial,Helvetica,sans-serif;">
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#0B0F0B;margin:0;padding:0;width:100%;">
				<tr>
					<td align="center" style="padding:28px 14px;">
						<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;max-width:680px;width:100%;background:#10160F;border:1px solid rgba(239,228,204,0.18);border-radius:10px;overflow:hidden;">
							<tr>
								<td style="padding:0;background:#0B0F0B;">
									<img src="${headerImageUrl}" alt="FHUGAWZ cinematic dark pop homepage hero" width="680" height="220" style="display:block;width:100%;max-width:680px;height:auto;border:0;line-height:100%;outline:none;text-decoration:none;" />
								</td>
							</tr>
							<tr>
								<td style="padding:30px 26px 20px 26px;border-bottom:1px solid rgba(239,228,204,0.14);">
									<img src="${logoUrl}" alt="FHUGAWZ Studio logo" width="156" style="display:block;width:156px;max-width:48%;height:auto;margin:0 0 18px 0;border:0;line-height:100%;outline:none;text-decoration:none;" />
									<p style="margin:0 0 8px 0;color:#FF5A1F;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">FHUGAWZ STUDIO</p>
									<h1 style="margin:0;color:#EFE4CC;font-size:28px;line-height:1.2;font-weight:800;">${escapeHtml(meta.label)}</h1>
									<p style="margin:12px 0 0 0;color:#B9AA93;font-size:14px;line-height:1.6;">A new lead brief was saved in Supabase.</p>
								</td>
							</tr>
							<tr>
								<td style="padding:22px 26px;">
									<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
										<tr>
											<td style="padding:0 0 14px 0;">
												<p style="margin:0 0 5px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Created at</p>
												<p style="margin:0;color:#EFE4CC;font-size:15px;line-height:1.6;">${escapeHtml(createdAt)}</p>
											</td>
										</tr>
										${renderBriefRows(briefData)}
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding:18px 26px 26px 26px;border-top:1px solid rgba(239,228,204,0.14);">
									<p style="margin:0;color:#B9AA93;font-size:12px;line-height:1.5;">This notification was generated by the FHUGAWZ Netlify brief function.</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	`;

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: formatSender(from),
			to,
			subject,
			text,
			html,
			reply_to: row.email,
		}),
	});

	if (!response.ok) {
		const error = await readResponseError(response);
		throw new Error(`Resend notification failed (${response.status} ${response.statusText}): ${error}`);
	}
};

export const handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return json(405, { success: false, message: 'Only POST requests are allowed.' });
	}

	try {
		logEnvPresence();

		const body = JSON.parse(event.body || '{}');
		const service_type = getString(body, 'service_type');
		const name = getString(body, 'name');
		const email = getString(body, 'email').toLowerCase();
		const honeypot = getString(body, 'honeypot');
		const started_at = body.started_at;

		if (honeypot) {
			return json(200, { success: true, message: 'Brief received. Thank you.' });
		}

		if (isTooFast(started_at)) {
			return json(400, { success: false, message: 'Please take a moment before sending.' });
		}

		if (!serviceMeta[service_type]) {
			return json(400, { success: false, message: 'Please choose a valid brief type.' });
		}

		if (!name || !email) {
			return json(400, { success: false, message: 'Please add your name and email before sending.' });
		}

		if (!isValidEmail(email)) {
			return json(400, { success: false, message: 'Please enter a valid email address.' });
		}

		const briefData = {};
		Object.entries(body.brief_data && typeof body.brief_data === 'object' ? body.brief_data : body).forEach(
			([key, value]) => {
				if (['honeypot', 'started_at'].includes(key)) return;
				briefData[key] = normalizeValue(value);
			}
		);
		briefData.service_type = service_type;
		briefData.email = email;
		briefData.name = name;

		if (hasObviousSpam(JSON.stringify(briefData))) {
			return json(400, { success: false, message: 'This brief could not be accepted.' });
		}

		const row = {
			service_type,
			source: 'website',
			status: 'new',
			brief_data: briefData,
		};

		commonFields.forEach((field) => {
			if (field === 'newsletter_consent') {
				row[field] = body[field] === true || briefData[field] === true;
				return;
			}

			const value =
				field === 'reference_links'
					? getString(body, 'reference_links') ||
						getString(body, 'references') ||
						valueToText(briefData.reference_links).trim() ||
						valueToText(briefData.references).trim()
					: getString(body, field) || valueToText(briefData[field]).trim();
			const maxLength = maxLengths[field];
			if (maxLength && value.length > maxLength) {
				throw new Error(`Field too long: ${field}`);
			}
			row[field] = value || null;
		});

		if (!row.main_problem && Array.isArray(briefData.main_concerns)) {
			row.main_problem = briefData.main_concerns.join(', ');
		}

		const response = await insertRow('lead_briefs', row);

		if (!response.ok) {
			const error = await readResponseError(response);
			console.error(
				`brief insert failed (${response.status} ${response.statusText}): ${error}`,
				{
					service_type: row.service_type,
					email: row.email,
					row_columns: Object.keys(row),
				}
			);
			return json(500, {
				success: false,
				message: 'The brief could not be sent right now. Please try again soon.',
			});
		}

		const insertedRows = await response.json().catch(() => []);
		const created_at = Array.isArray(insertedRows) ? insertedRows[0]?.created_at : undefined;

		try {
			await sendBriefNotification({
				row,
				briefData,
				created_at,
			});
		} catch (error) {
			console.error('brief notification failed', error instanceof Error ? error.message : error, error);
		}

		return json(200, { success: true, message: 'Brief sent. Thank you for sharing the project.' });
	} catch (error) {
		console.error('brief function error', error);
		const message =
			error instanceof Error && error.message.startsWith('Field too long')
				? 'Some fields are too long. Please shorten the brief and try again.'
				: 'The brief could not be sent right now. Please try again soon.';

		return json(500, {
			success: false,
			message,
		});
	}
};
