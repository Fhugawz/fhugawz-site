const json = (statusCode, body) => ({
	statusCode,
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(body),
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const insertSubscriber = async (email) => {
	const supabaseUrl = process.env.SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error('Supabase environment variables are not configured.');
	}

	return fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/blog_subscribers?on_conflict=email`, {
		method: 'POST',
		headers: {
			apikey: serviceRoleKey,
			Authorization: `Bearer ${serviceRoleKey}`,
			'Content-Type': 'application/json',
			Prefer: 'resolution=ignore-duplicates,return=minimal',
		},
		body: JSON.stringify({ email }),
	});
};

export const handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return json(405, { success: false, message: 'Only POST requests are allowed.' });
	}

	try {
		const body = JSON.parse(event.body || '{}');
		const email = String(body.email || '').trim().toLowerCase();
		const honeypot = String(body.honeypot || '').trim();

		if (honeypot) {
			return json(200, { success: true, message: 'Thanks. You are on the list.' });
		}

		if (!email) {
			return json(400, { success: false, message: 'Please enter your email address.' });
		}

		if (!isValidEmail(email)) {
			return json(400, { success: false, message: 'Please enter a valid email address.' });
		}

		const response = await insertSubscriber(email);

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			if (response.status === 409 || error.code === '23505') {
				return json(200, { success: true, message: 'Thanks. You are already on the list.' });
			}

			console.error('subscribe insert failed', error);
			return json(500, {
				success: false,
				message: 'Subscription could not be saved right now. Please try again soon.',
			});
		}

		return json(200, { success: true, message: 'Thanks. You are on the list.' });
	} catch (error) {
		console.error('subscribe function error', error);
		return json(500, {
			success: false,
			message: 'Subscription could not be saved right now. Please try again soon.',
		});
	}
};
