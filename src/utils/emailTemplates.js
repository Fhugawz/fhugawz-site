const HERO_IMAGE_URL = 'https://fhugawz.com/images/hero/fhugawz-cinematic-dark-pop-hero.webp';
const SITE_URL = 'https://fhugawz.com';

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

const normalizeTemplateData = (data = {}) => ({
	name: String(data.name || '').trim() || 'there',
	service: String(data.service || '').trim() || 'your project',
	message: String(data.message || '').trim(),
	nextStep: String(data.nextStep || '').trim(),
	signatureName: String(data.signatureName || '').trim() || 'Jean',
});

const paragraph = (content) =>
	`<p style="margin:0 0 16px 0;color:#EFE4CC;font-size:16px;line-height:1.7;">${content}</p>`;

const renderEmail = ({ title, eyebrow = 'FHUGAWZ STUDIO', preheader, body, signatureName }) => {
	const safePreheader = escapeHtml(preheader);

	return `
		<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px;font-size:1px;mso-hide:all;">
			${safePreheader}
		</div>
		<div style="margin:0;padding:0;background:#0B0F0B;color:#EFE4CC;font-family:Arial,Helvetica,sans-serif;">
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#0B0F0B;margin:0;padding:0;width:100%;">
				<tr>
					<td align="center" style="padding:28px 14px;">
						<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;max-width:640px;width:100%;background:#10160F;border:1px solid rgba(239,228,204,0.18);border-radius:10px;overflow:hidden;">
							<tr>
								<td style="padding:0;background:#0B0F0B;">
									<img src="${HERO_IMAGE_URL}" alt="FHUGAWZ cinematic dark pop atmosphere" width="640" style="display:block;width:100%;max-width:640px;height:auto;border:0;line-height:100%;outline:none;text-decoration:none;" />
								</td>
							</tr>
							<tr>
								<td style="padding:30px 26px 18px 26px;border-bottom:1px solid rgba(239,228,204,0.14);">
									<p style="margin:0 0 8px 0;color:#FF5A1F;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
									<h1 style="margin:0;color:#EFE4CC;font-size:28px;line-height:1.2;font-weight:800;">${escapeHtml(title)}</h1>
								</td>
							</tr>
							<tr>
								<td style="padding:24px 26px 8px 26px;">
									${body}
									<p style="margin:8px 0 0 0;color:#EFE4CC;font-size:16px;line-height:1.7;">${escapeHtml(signatureName)}</p>
								</td>
							</tr>
							<tr>
								<td style="padding:20px 26px 26px 26px;border-top:1px solid rgba(239,228,204,0.14);">
									<p style="margin:0 0 6px 0;color:#EFE4CC;font-size:13px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">FHUGAWZ Studio</p>
									<p style="margin:0 0 8px 0;color:#B9AE99;font-size:13px;line-height:1.6;">Dark pop production, mixing, mastering and artist world building.</p>
									<p style="margin:0;color:#B9AE99;font-size:13px;line-height:1.6;"><a href="${SITE_URL}" style="color:#FF5A1F;text-decoration:underline;">${SITE_URL}</a></p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	`;
};

export const initialReplyTemplate = (data = {}) => {
	const { name, service, nextStep, signatureName } = normalizeTemplateData(data);
	const subject = 'About your project — next step from FHUGAWZ';
	const safeName = escapeHtml(name);
	const safeService = escapeHtml(service);
	const nextStepLine = nextStep
		? paragraph(escapeHtml(nextStep))
		: paragraph(
				'If you want, send me a little more context about where the song or project is right now, what you want it to become, and what feels most urgent to solve first.'
			);

	const body = [
		paragraph(`Hi ${safeName},`),
		paragraph('Thank you for reaching out. I reviewed your message and wanted to answer personally.'),
		paragraph(
			`For ${safeService}, the most useful first step is getting the direction clear: what the project needs emotionally, structurally and sonically before talking about a fixed quote.`
		),
		paragraph(
			'Every project needs direction, structure and a next move that actually fits the material. From there, we can define whether it needs production, mixing, mastering, a visual world, release strategy or a combination of those pieces.'
		),
		nextStepLine,
		paragraph('I am happy to continue the conversation and help you find the cleanest next step.'),
	].join('');

	const text = [
		subject,
		'',
		`Hi ${name},`,
		'',
		'Thank you for reaching out. I reviewed your message and wanted to answer personally.',
		`For ${service}, the most useful first step is getting the direction clear: what the project needs emotionally, structurally and sonically before talking about a fixed quote.`,
		'Every project needs direction, structure and a next move that actually fits the material.',
		nextStep ||
			'If you want, send me a little more context about where the song or project is right now, what you want it to become, and what feels most urgent to solve first.',
		'',
		'I am happy to continue the conversation and help you find the cleanest next step.',
		'',
		signatureName,
		'',
		'FHUGAWZ Studio',
		'Dark pop production, mixing, mastering and artist world building.',
		SITE_URL,
	].join('\n');

	return {
		subject,
		html: renderEmail({
			title: 'About your project',
			preheader: 'Jean reviewed your message and is ready to help shape the next step.',
			body,
			signatureName,
		}),
		text,
	};
};

export const followUpTemplate = (data = {}) => {
	const { name, service, nextStep, signatureName } = normalizeTemplateData(data);
	const subject = 'Following up on your project — FHUGAWZ';
	const safeName = escapeHtml(name);
	const safeService = escapeHtml(service);
	const nextStepLine = nextStep
		? paragraph(escapeHtml(nextStep))
		: paragraph(
				'No pressure if timing changed. If the project is still active, we can pick it back up and organize the next step from there.'
			);

	const body = [
		paragraph(`Hi ${safeName},`),
		paragraph(`I wanted to follow up on ${safeService} and see if it is still something you want to move forward.`),
		paragraph(
			'If the project is still active, FHUGAWZ can help organize the next step so the idea has a clearer path instead of staying in a rough or unfinished place.'
		),
		nextStepLine,
		paragraph('Either way, the door stays open.'),
	].join('');

	const text = [
		subject,
		'',
		`Hi ${name},`,
		'',
		`I wanted to follow up on ${service} and see if it is still something you want to move forward.`,
		'If the project is still active, FHUGAWZ can help organize the next step so the idea has a clearer path instead of staying in a rough or unfinished place.',
		nextStep ||
			'No pressure if timing changed. If the project is still active, we can pick it back up and organize the next step from there.',
		'',
		'Either way, the door stays open.',
		'',
		signatureName,
		'',
		'FHUGAWZ Studio',
		'Dark pop production, mixing, mastering and artist world building.',
		SITE_URL,
	].join('\n');

	return {
		subject,
		html: renderEmail({
			title: 'Following up',
			preheader: 'A calm follow up from FHUGAWZ about your project.',
			body,
			signatureName,
		}),
		text,
	};
};

export const nextStepTemplate = (data = {}) => {
	const { name, service, message, nextStep, signatureName } = normalizeTemplateData(data);
	const subject = 'Your project direction — FHUGAWZ';
	const safeName = escapeHtml(name);
	const safeService = escapeHtml(service);
	const contextLine = message
		? paragraph(`Based on what you shared - ${escapeHtml(message)} - the project would benefit from a clear production direction before moving into execution.`)
		: paragraph(
				`Based on what you shared about ${safeService}, the project would benefit from a clear production direction before moving into execution.`
			);
	const nextStepLine = nextStep
		? paragraph(escapeHtml(nextStep))
		: paragraph(
				'The next step is defining scope and priorities: what needs to be solved first, what can wait, and what kind of final result you want to build toward.'
			);

	const body = [
		paragraph(`Hi ${safeName},`),
		contextLine,
		paragraph(
			'That direction can include sound, structure, arrangement, mixing, mastering, visual world, release strategy or the way all of those pieces connect.'
		),
		nextStepLine,
		paragraph('Confirm what you want to focus on first, and I can help shape the proposal around that priority.'),
	].join('');

	const text = [
		subject,
		'',
		`Hi ${name},`,
		'',
		message
			? `Based on what you shared - ${message} - the project would benefit from a clear production direction before moving into execution.`
			: `Based on what you shared about ${service}, the project would benefit from a clear production direction before moving into execution.`,
		'That direction can include sound, structure, arrangement, mixing, mastering, visual world, release strategy or the way all of those pieces connect.',
		nextStep ||
			'The next step is defining scope and priorities: what needs to be solved first, what can wait, and what kind of final result you want to build toward.',
		'',
		'Confirm what you want to focus on first, and I can help shape the proposal around that priority.',
		'',
		signatureName,
		'',
		'FHUGAWZ Studio',
		'Dark pop production, mixing, mastering and artist world building.',
		SITE_URL,
	].join('\n');

	return {
		subject,
		html: renderEmail({
			title: 'Your project direction',
			preheader: 'A strategic next step for shaping your project with FHUGAWZ.',
			body,
			signatureName,
		}),
		text,
	};
};
