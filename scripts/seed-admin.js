import 'dotenv/config';
import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.resolve(rootDir, 'server', 'data');
const writerAuthFile = path.resolve(dataDir, 'writer-auth.json');

const writerEmail = process.env.WRITER_EMAIL;
const writerPassword = process.env.WRITER_PASSWORD;

if (!writerEmail || !writerPassword) {
  console.error('WRITER_EMAIL and WRITER_PASSWORD must be set before running this script.');
  process.exit(1);
}

await fs.mkdir(dataDir, { recursive: true });

try {
  await fs.access(writerAuthFile);
  console.error('server/data/writer-auth.json already exists. Delete it first if you need to reseed.');
  process.exit(1);
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

const passwordHash = await bcrypt.hash(writerPassword, 10);

await fs.writeFile(
  writerAuthFile,
  JSON.stringify({
    email: writerEmail,
    passwordHash,
    updatedAt: new Date().toISOString()
  }, null, 2)
);

console.log('Admin credentials seeded at server/data/writer-auth.json');
