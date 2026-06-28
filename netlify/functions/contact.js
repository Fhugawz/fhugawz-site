const json = (statusCode, body) => ({
	statusCode,
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(body),
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
			Prefer: 'return=minimal',
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

		if (honeypot) {
			return json(200, { success: true, message: 'Message received. Thank you.' });
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

		return json(200, { success: true, message: 'Message sent. Thank you for reaching out.' });
	} catch (error) {
		console.error('contact function error', error);
		return json(500, {
			success: false,
			message: 'The message could not be sent right now. Please try again soon.',
		});
	}
};
