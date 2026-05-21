import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import { initDb, publicDir, rootDir } from './db/database.js';

const PORT = process.env.PORT || 3000;
const WRITER_EMAIL = process.env.WRITER_EMAIL || 'saditto.adiya@gmail.com';
const WRITER_PASSWORD = process.env.WRITER_PASSWORD || 'changeme123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

await initDb();

const app = express();

app.locals.writer = {
  email: WRITER_EMAIL,
  passwordHash: await bcrypt.hash(WRITER_PASSWORD, 10)
};

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.SESSION_COOKIE_SECURE === 'true'
  }
}));

app.use(express.static(publicDir));
app.use('/admin', express.static(path.join(rootDir, 'admin')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', authRoutes);
app.use('/api/content', contentRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Portfolio CMS API running on http://localhost:${PORT}`);
});
