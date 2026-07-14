import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicRoot = path.join(root, 'public');
const imageRoot = path.join(root, 'public', 'images');
const configuredBackupRoot = process.env.IMAGE_BACKUP_DIR?.trim();
const backupRoot = configuredBackupRoot
	? path.resolve(configuredBackupRoot)
	: path.join(root, '.local', 'image-backups');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const skipPattern = /(^|[\\/])brand([\\/]|$)|logo|favicon|transparent/i;

if (backupRoot === publicRoot || backupRoot.startsWith(`${publicRoot}${path.sep}`)) {
	throw new Error('IMAGE_BACKUP_DIR must resolve outside the public directory.');
}

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const walk = async (directory) => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
			continue;
		}

		files.push(fullPath);
	}

	return files;
};

const preserveOriginal = async (backupPath, original) => {
	await mkdir(path.dirname(backupPath), { recursive: true });

	try {
		await writeFile(backupPath, original, { flag: 'wx' });
		return 'created';
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST') {
			throw error;
		}

		const existing = await readFile(backupPath);
		if (!existing.equals(original)) {
			throw new Error(`Backup already exists with different content: ${backupPath}`);
		}

		return 'verified';
	}
};

const optimize = async (filePath) => {
	const relativePath = path.relative(imageRoot, filePath);
	const extension = path.extname(filePath).toLowerCase();

	if (!allowedExtensions.has(extension) || skipPattern.test(relativePath)) {
		return { skipped: true, before: 0, after: 0, relativePath };
	}

	const original = await readFile(filePath);
	const image = sharp(original, { animated: true });
	const metadata = await image.metadata();
	let optimized;

	if (metadata.format === 'webp') {
		optimized = await image.webp({ quality: 86, effort: 4 }).toBuffer();
	} else if (metadata.format === 'jpeg') {
		optimized = await image.jpeg({ quality: 86, mozjpeg: true }).toBuffer();
	} else if (metadata.format === 'png') {
		optimized = await image.png({ compressionLevel: 9, adaptiveFiltering: true, quality: 86 }).toBuffer();
	} else {
		return { skipped: true, before: original.length, after: original.length, relativePath };
	}

	if (optimized.length >= original.length) {
		return { skipped: true, before: original.length, after: original.length, relativePath };
	}

	const backupPath = path.join(backupRoot, relativePath);
	const backupStatus = await preserveOriginal(backupPath, original);
	await writeFile(filePath, optimized);

	return {
		skipped: false,
		before: original.length,
		after: optimized.length,
		relativePath,
		backupStatus,
	};
};

await mkdir(backupRoot, { recursive: true });
const files = await walk(imageRoot);
let totalBefore = 0;
let totalAfter = 0;
let optimizedCount = 0;
let createdBackupCount = 0;
let verifiedBackupCount = 0;

for (const file of files) {
	const fileStat = await stat(file);
	const result = await optimize(file);

	if (result.before === 0 && result.after === 0) continue;

	totalBefore += result.before || fileStat.size;
	totalAfter += result.after || fileStat.size;

	if (!result.skipped) {
		optimizedCount += 1;
		if (result.backupStatus === 'created') createdBackupCount += 1;
		if (result.backupStatus === 'verified') verifiedBackupCount += 1;
		console.log(
			`optimized ${result.relativePath}: ${formatBytes(result.before)} -> ${formatBytes(result.after)}`,
		);
	}
}

const saved = totalBefore - totalAfter;
console.log(`Optimized files: ${optimizedCount}`);
console.log(`Before: ${formatBytes(totalBefore)}`);
console.log(`After: ${formatBytes(totalAfter)}`);
console.log(`Saved: ${formatBytes(saved)}`);
console.log(`Backups created: ${createdBackupCount}`);
console.log(`Existing backups verified: ${verifiedBackupCount}`);
console.log(`Backup directory: ${backupRoot}`);
