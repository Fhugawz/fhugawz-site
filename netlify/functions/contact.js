const json = (statusCode, body) => ({
	statusCode,
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(body),
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const hasObviousSpam = (value) => {
	const text = String(value || '').toLowerCase();
	const urls = text.match(/https?:\/\/|www\./g) || [];
	return (
		urls.length > 2 ||
		/<\/?[a-z][\s\S]*>/i.test(text) ||
		/\b(viagra|casino|crypto giveaway|seo services|telegram spam)\b/i.test(text)
	);
};

const isTooFast = (startedAt) => {
	const submittedAt = Number(startedAt);
	return Number.isFinite(submittedAt) && Date.now() - submittedAt < 1200;
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

const formatSender = (email) => {
	const emailAddress = String(email || '').match(/<([^>]+)>/)?.[1] || String(email || '').trim();
	return `FHUGAWZ Studio <${emailAddress}>`;
};

const sendContactNotification = async ({ name, email, selected_service, message, created_at }) => {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) return;

	const to = process.env.CONTACT_NOTIFICATION_EMAIL;
	const from = process.env.CONTACT_FROM_EMAIL;
	if (!to || !from) {
		console.error('contact notification skipped: CONTACT_NOTIFICATION_EMAIL or CONTACT_FROM_EMAIL is missing');
		return;
	}

	const selectedService = selected_service || '';
	const selectedServiceLabel = selectedService || 'Not selected';
	const createdAt = created_at || new Date().toISOString();
	const subject = selectedService ? `New FHUGAWZ inquiry — ${selectedService}` : 'New FHUGAWZ inquiry';
	const preheader =
		'A new project message was received and saved in Supabase. Review the details from FHUGAWZ Studio.';
	const logoUrl = 'https://fhugawz.com/images/brand/fhugawz-full-logo-transparent-light.svg';
	const headerImageUrl = 'https://fhugawz.com/images/hero/fhugawz-cinematic-dark-pop-hero.webp';
	const text = [
		subject,
		'FHUGAWZ STUDIO',
		'New inquiry received',
		'A new contact form message was saved in Supabase.',
		'',
		`Name: ${name}`,
		`Email: ${email}`,
		`Selected service: ${selectedServiceLabel}`,
		`Created at: ${createdAt}`,
		'',
		'Message:',
		message,
	].join('\n');
	const html = `
		<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px;font-size:1px;mso-hide:all;">
			${escapeHtml(preheader)}
		</div>
		<div style="margin:0;padding:0;background:#0B0F0B;color:#EFE4CC;font-family:Arial,Helvetica,sans-serif;">
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#0B0F0B;margin:0;padding:0;width:100%;">
				<tr>
					<td align="center" style="padding:28px 14px;">
						<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;max-width:640px;width:100%;background:#10160F;border:1px solid rgba(239,228,204,0.18);border-radius:10px;overflow:hidden;">
							<tr>
								<td style="padding:0;background:#0B0F0B;">
									<img src="${headerImageUrl}" alt="FHUGAWZ cinematic dark pop homepage hero" width="640" height="220" style="display:block;width:100%;max-width:640px;height:auto;border:0;line-height:100%;outline:none;text-decoration:none;" />
								</td>
							</tr>
							<tr>
								<td style="padding:30px 26px 20px 26px;border-bottom:1px solid rgba(239,228,204,0.14);">
									<img src="${logoUrl}" alt="FHUGAWZ Studio logo" width="156" style="display:block;width:156px;max-width:48%;height:auto;margin:0 0 18px 0;border:0;line-height:100%;outline:none;text-decoration:none;" />
									<p style="margin:0 0 8px 0;color:#FF5A1F;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">FHUGAWZ STUDIO</p>
									<h1 style="margin:0;color:#EFE4CC;font-size:28px;line-height:1.2;font-weight:800;">New inquiry received</h1>
									<p style="margin:12px 0 0 0;color:#B9AA93;font-size:14px;line-height:1.6;">A new contact form message was saved in Supabase.</p>
								</td>
							</tr>
							<tr>
								<td style="padding:22px 26px;">
									<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
										<tr>
											<td style="padding:0 0 14px 0;">
												<p style="margin:0 0 5px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Name</p>
												<p style="margin:0;color:#EFE4CC;font-size:16px;line-height:1.5;">${escapeHtml(name)}</p>
											</td>
										</tr>
										<tr>
											<td style="padding:0 0 14px 0;">
												<p style="margin:0 0 5px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Email</p>
												<p style="margin:0;color:#EFE4CC;font-size:16px;line-height:1.5;"><a href="mailto:${escapeHtml(email)}" style="color:#EFE4CC;text-decoration:underline;">${escapeHtml(email)}</a></p>
											</td>
										</tr>
										<tr>
											<td style="padding:0 0 14px 0;">
												<p style="margin:0 0 5px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Selected service</p>
												<p style="margin:0;color:#EFE4CC;font-size:16px;line-height:1.5;">${escapeHtml(selectedServiceLabel)}</p>
											</td>
										</tr>
										<tr>
											<td style="padding:0 0 14px 0;">
												<p style="margin:0 0 5px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Created at</p>
												<p style="margin:0;color:#EFE4CC;font-size:16px;line-height:1.5;">${escapeHtml(createdAt)}</p>
											</td>
										</tr>
										<tr>
											<td style="padding:18px 18px;background:#0B0F0B;border:1px solid rgba(239,228,204,0.18);border-radius:8px;">
												<p style="margin:0 0 8px 0;color:#FF5A1F;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Message</p>
												<p style="margin:0;color:#EFE4CC;font-size:16px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding:18px 26px 26px 26px;border-top:1px solid rgba(239,228,204,0.14);">
									<p style="margin:0;color:#B9AA93;font-size:12px;line-height:1.5;">This notification was generated by the FHUGAWZ Netlify contact function.</p>
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
			reply_to: email,
		}),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(`Resend notification failed: ${JSON.stringify(error)}`);
	}
};

const insertRow = async (table, row) => {
	const supabaseUrl = process.env.SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error('Supabase environment variables are not configured.');
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

export const handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return json(405, { success: false, message: 'Only POST requests are allowed.' });
	}

	try {
		const body = JSON.parse(event.body || '{}');
		const name = String(body.name || '').trim();
		const email = String(body.email || '').trim().toLowerCase();
		const selected_service = String(body.selected_service || '').trim();
		const message = String(body.message || '').trim();
		const honeypot = String(body.honeypot || '').trim();
		const started_at = body.started_at;

		if (honeypot) {
			return json(200, { success: true, message: 'Message received. Thank you.' });
		}

		if (isTooFast(started_at)) {
			return json(400, { success: false, message: 'Please take a moment before sending.' });
		}

		if (!name || !email || !message) {
			return json(400, {
				success: false,
				message: 'Please add your name, email and message before sending.',
			});
		}

		if (!isValidEmail(email)) {
			return json(400, { success: false, message: 'Please enter a valid email address.' });
		}

		if (
			name.length > 120 ||
			email.length > 254 ||
			selected_service.length > 100 ||
			message.length > 3000
		) {
			return json(400, {
				success: false,
				message: 'Some fields are too long. Please shorten your message and try again.',
			});
		}

		if (hasObviousSpam(`${name} ${email} ${selected_service} ${message}`)) {
			return json(400, { success: false, message: 'This message could not be accepted.' });
		}

		const response = await insertRow('contact_messages', {
			name,
			email,
			selected_service: selected_service || null,
			message,
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			console.error('contact insert failed', error);
			return json(500, {
				success: false,
				message: 'The message could not be sent right now. Please try again soon.',
			});
		}

		const insertedRows = await response.json().catch(() => []);
		const created_at = Array.isArray(insertedRows) ? insertedRows[0]?.created_at : undefined;

		try {
			await sendContactNotification({
				name,
				email,
				selected_service,
				message,
				created_at,
			});
		} catch (error) {
			console.error('contact notification failed', error);
		}

		return json(200, { success: true, message: 'Message sent. Thank you for reaching out.' });
	} catch (error) {
		console.error('contact function error', error);
		return json(500, {
			success: false,
			message: 'The message could not be sent right now. Please try again soon.',
		});
	}
};
