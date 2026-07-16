const allowedServices = new Set([
	'demo_reconstruction',
	'music_production',
	'mixing_mastering',
]);

const serviceDefinitions = [
	{
		serviceType: 'demo_reconstruction',
		label: 'Demo Reconstruction',
		suffix: 'DR',
		fields: {
			ai_platform: 'suno',
			material_links: 'https://fhugawz.com/',
			lyrics: 'Controlled technical test. No client lyrics.',
			keep_from_demo: 'Keep the intended structure and emotional direction.',
			main_problem: 'Controlled validation of storage, notification and duplicate protection.',
			creative_changes: 'moderate',
			references: 'https://fhugawz.com/',
			intended_release_format: 'Internal test only',
		},
	},
	{
		serviceType: 'music_production',
		label: 'Music Production',
		suffix: 'MP',
		fields: {
			material_links: 'https://fhugawz.com/',
			lyrics: 'Controlled technical test. No client lyrics.',
			project_stage: 'Internal technical validation with no real production material.',
			emotion_story_atmosphere: 'Controlled neutral test for the Fhugawz Studio intake system.',
			references: 'https://fhugawz.com/',
			existing_production_elements: 'No real production elements. Internal test only.',
			main_problem: 'Controlled validation of storage, notification and duplicate protection.',
			intended_release_format: 'Internal test only',
		},
	},
	{
		serviceType: 'mixing_mastering',
		label: 'Mixing / Mastering',
		suffix: 'MM',
		fields: {
			material_links: 'https://fhugawz.com/',
			stems_link: 'https://fhugawz.com/',
			references: 'https://fhugawz.com/',
			main_concerns: ['vocal_presence', 'low_end', 'translation'],
			technical_notes: 'No real stems. Controlled internal test only.',
			main_problem: 'Controlled validation of storage, notification and duplicate protection.',
			intended_release_format: 'Internal test only',
		},
	},
];

const requiredEnvironment = ['BRIEF_TEST_BASE_URL', 'BRIEF_TEST_EMAIL'];
const missingEnvironment = requiredEnvironment.filter((name) => !String(process.env[name] || '').trim());

if (missingEnvironment.length) {
	console.error(`Missing required environment variable(s): ${missingEnvironment.join(', ')}`);
	process.exitCode = 1;
} else {
	await main();
}

async function main() {
	const dryRun = process.argv.slice(2).includes('--dry-run');
	const baseUrl = process.env.BRIEF_TEST_BASE_URL.trim().replace(/\/+$/, '');
	const email = process.env.BRIEF_TEST_EMAIL.trim();
	const endpoint = `${baseUrl}/.netlify/functions/brief`;
	const executionId = createExecutionId(new Date());
	const payloads = serviceDefinitions.map((definition) => createPayload(definition, executionId, email));

	try {
		payloads.forEach(validatePayload);
	} catch (error) {
		console.error(`Safety validation failed. No requests were sent. ${error.message}`);
		process.exitCode = 1;
		return;
	}

	if (dryRun) {
		console.log('DRY RUN — payloads validated; no network requests will be sent.');
		for (const { definition, identifier, payload } of payloads) {
			console.log(`\n${definition.label} — ${identifier}`);
			console.log(JSON.stringify(maskPayloadEmail(payload), null, 2));
		}
		printIdentifiers(payloads);
		console.log('\nAll dry-run safety validations passed.');
		return;
	}

	const results = [];
	for (const testCase of payloads) {
		results.push(await testServiceFlow(endpoint, testCase));
	}

	console.log('\nSummary');
	for (const result of results) console.log(`${result.label}: ${result.passed ? 'PASS' : 'FAIL'}`);
	printIdentifiers(payloads);

	const failures = results.filter((result) => !result.passed);
	if (failures.length) {
		console.error(`\nControlled brief-flow test failure(s): ${failures.map(({ label, failedStage }) => `${label} (${failedStage})`).join(', ')}.`);
		process.exitCode = 1;
		return;
	}

	console.log('\nAll controlled brief-flow tests passed.');
}

function createExecutionId(date) {
	const compactUtc = date.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
	return `PHASE4-E2E-${compactUtc}`;
}

function createPayload(definition, executionId, email) {
	const identifier = `${executionId}-${definition.suffix}`;
	const additionalNotes = `${identifier} — controlled internal test; safe to delete after validation`;
	const briefData = {
		service_type: definition.serviceType,
		name: 'Fhugawz Phase 4 Test',
		artist_name: identifier,
		email,
		...definition.fields,
		deadline: 'No real deadline — controlled test',
		level_of_support: 'essential',
		additional_notes: additionalNotes,
		newsletter_consent: false,
	};

	return {
		definition,
		identifier,
		payload: {
			...briefData,
			service_type: definition.serviceType,
			honeypot: '',
			started_at: Date.now() - 5000,
			brief_data: { ...briefData },
		},
	};
}

function validatePayload({ payload }) {
	if (!payload.artist_name.startsWith('PHASE4-E2E-')) throw new Error('artist_name must start with PHASE4-E2E-.');
	if (!payload.additional_notes.includes('PHASE4-E2E-')) throw new Error('additional_notes must contain PHASE4-E2E-.');
	if (payload.newsletter_consent !== false) throw new Error('newsletter_consent must be false.');
	if (!allowedServices.has(payload.service_type)) throw new Error(`Service is not allowed: ${payload.service_type}`);
	if (payload.brief_data.artist_name !== payload.artist_name) throw new Error('brief_data artist_name does not match the top-level value.');
	if (payload.brief_data.additional_notes !== payload.additional_notes) throw new Error('brief_data additional_notes does not match the top-level value.');
	if (payload.brief_data.newsletter_consent !== false) throw new Error('brief_data newsletter_consent must be false.');
	if (payload.brief_data.service_type !== payload.service_type) throw new Error('brief_data service_type does not match the top-level value.');
}

async function testServiceFlow(endpoint, { definition, identifier, payload }) {
	const result = { label: definition.label, passed: false, failedStage: 'first submission' };
	let first;
	let duplicate;

	try {
		first = await postBrief(endpoint, payload);
		const firstPassed = first.status === 200
			&& first.body.success === true
			&& String(first.body.message || '').toLowerCase().includes('brief sent');
		if (!firstPassed) throw new Error('First submission did not return the expected success response.');

		await new Promise((resolve) => setTimeout(resolve, 1500));
		result.failedStage = 'duplicate submission';
		duplicate = await postBrief(endpoint, payload);
		const duplicateMessage = String(duplicate.body.message || '').toLowerCase();
		const duplicatePassed = duplicate.status === 200
			&& duplicate.body.success === true
			&& duplicateMessage.includes('already received')
			&& duplicateMessage.includes('no duplicate was created');
		if (!duplicatePassed) throw new Error('Duplicate submission did not return the expected deduplication response.');

		result.passed = true;
	} catch (error) {
		result.error = error instanceof Error ? error.message : String(error);
	}

	console.log(`\nService: ${definition.label}`);
	console.log(`Identifier: ${identifier}`);
	console.log(`First HTTP status: ${first?.status ?? 'NOT SENT'}`);
	console.log(`First message: ${first?.body?.message ?? first?.error ?? 'Unavailable'}`);
	console.log(`Duplicate HTTP status: ${duplicate?.status ?? 'NOT SENT'}`);
	console.log(`Duplicate message: ${duplicate?.body?.message ?? duplicate?.error ?? 'Unavailable'}`);
	console.log(`Result: ${result.passed ? 'PASS' : 'FAIL'}${result.error ? ` — ${result.error}` : ''}`);

	return result;
}

async function postBrief(endpoint, payload) {
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	const text = await response.text();
	let body;
	try {
		body = JSON.parse(text);
	} catch {
		throw new Error(`HTTP ${response.status} returned invalid JSON.`);
	}
	return { status: response.status, body };
}

function maskPayloadEmail(payload) {
	const maskedEmail = maskEmail(payload.email);
	return { ...payload, email: maskedEmail, brief_data: { ...payload.brief_data, email: maskedEmail } };
}

function maskEmail(email) {
	const [localPart, domain = ''] = email.split('@');
	const visible = localPart.length > 1 ? localPart[0] : '';
	return `${visible}***@${domain}`;
}

function printIdentifiers(payloads) {
	console.log('\nIdentifiers for review and cleanup:');
	for (const { identifier } of payloads) console.log(identifier);
}
