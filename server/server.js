import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'node:path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import { initDb, rootDir } from './db/database.js';
import { loadWriterAuth } from './db/writerAuth.js';

const PORT = process.env.PORT || 3000;
const WRITER_EMAIL = process.env.WRITER_EMAIL || '';
const WRITER_PASSWORD = process.env.WRITER_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';
const NODE_ENV = process.env.NODE_ENV || 'development';

await initDb();

const app = express();

app.locals.writer = await loadWriterAuth(WRITER_EMAIL, WRITER_PASSWORD);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "https://*.tile.openstreetmap.org"
      ],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000
  }
}));

// Serve uploaded images from /images/ URL path
app.use('/images', express.static(path.join(rootDir, 'images')));

// Serve portfolio CSS and JS
app.use('/css', express.static(path.join(rootDir, 'css')));
app.use('/js',  express.static(path.join(rootDir, 'js')));

// Serve the portfolio index.html at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.use('/admin', express.static(path.join(rootDir, 'admin')));

app.post('/api/login', loginLimiter);
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/geocode/reverse', async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90 ||
        !Number.isFinite(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Valid lat and lng query parameters are required' });
    }

    const params = new URLSearchParams({
      format: 'json',
      lat: String(lat),
      lon: String(lng)
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'portfolio-cms/1.0'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status >= 500 ? 502 : response.status).json({
        error: data && data.error ? data.error : 'Could not detect name'
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
});

app.use('/api', authRoutes);
app.use('/api/content', contentRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = NODE_ENV === 'production'
    ? 'Something went wrong.'
    : err.message;
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Portfolio CMS API running on http://localhost:${PORT}`);
});
