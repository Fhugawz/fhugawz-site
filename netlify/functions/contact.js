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

const sendContactNotification = async ({ name, email, selected_service, message, created_at }) => {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) return;

	const to = process.env.CONTACT_NOTIFICATION_EMAIL;
	const from = process.env.CONTACT_FROM_EMAIL;
	if (!to || !from) {
		console.error('contact notification skipped: CONTACT_NOTIFICATION_EMAIL or CONTACT_FROM_EMAIL is missing');
		return;
	}

	const subject = `New FHUGAWZ contact message from ${name}`;
	const text = [
		'New FHUGAWZ contact message',
		'',
		`Name: ${name}`,
		`Email: ${email}`,
		`Selected service: ${selected_service || 'Not selected'}`,
		`Created at: ${created_at || new Date().toISOString()}`,
		'',
		'Message:',
		message,
	].join('\n');

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from,
			to,
			subject,
			text,
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
