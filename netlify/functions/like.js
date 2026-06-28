const json = (statusCode, body) => ({
	statusCode,
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(body),
});

const insertLike = async (article_slug, visitor_hash) => {
	const supabaseUrl = process.env.SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error('Supabase environment variables are not configured.');
	}

	return fetch(
		`${supabaseUrl.replace(/\/$/, '')}/rest/v1/blog_likes?on_conflict=article_slug,visitor_hash`,
		{
			method: 'POST',
			headers: {
				apikey: serviceRoleKey,
				Authorization: `Bearer ${serviceRoleKey}`,
				'Content-Type': 'application/json',
				Prefer: 'resolution=ignore-duplicates,return=minimal',
			},
			body: JSON.stringify({ article_slug, visitor_hash }),
		}
	);
};

export const handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return json(405, { success: false, message: 'Only POST requests are allowed.' });
	}

	try {
		const body = JSON.parse(event.body || '{}');
		const article_slug = String(body.article_slug || '').trim();
		const visitor_hash = String(body.visitor_hash || '').trim();
		const honeypot = String(body.honeypot || '').trim();

		if (honeypot) {
			return json(200, { success: true, message: 'Like saved.' });
		}

		if (!article_slug || !visitor_hash) {
			return json(400, {
				success: false,
				message: 'Article and visitor information are required.',
			});
		}

		const response = await insertLike(article_slug, visitor_hash);

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			if (response.status === 409 || error.code === '23505') {
				return json(200, { success: true, message: 'You already liked this article.' });
			}

			console.error('like insert failed', error);
			return json(500, {
				success: false,
				message: 'The like could not be saved right now. Please try again soon.',
			});
		}

		return json(200, { success: true, message: 'Like saved.' });
	} catch (error) {
		console.error('like function error', error);
		return json(500, {
			success: false,
			message: 'The like could not be saved right now. Please try again soon.',
		});
	}
};
