import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { dataDir } from './database.js';

const writerAuthFile = path.resolve(dataDir, 'writer-auth.json');

export async function loadWriterAuth(email, defaultPassword) {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    const raw = await fs.readFile(writerAuthFile, 'utf8');
    const stored = JSON.parse(raw);

    if (stored && typeof stored.passwordHash === 'string') {
      return {
        email,
        passwordHash: stored.passwordHash
      };
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const passwordHash = await bcrypt.hash(defaultPassword, 10);
  await saveWriterPasswordHash(email, passwordHash);

  return {
    email,
    passwordHash
  };
}

export async function saveWriterPasswordHash(email, passwordHash) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(
    writerAuthFile,
    JSON.stringify({
      email,
      passwordHash,
      updatedAt: new Date().toISOString()
    }, null, 2)
  );
}
