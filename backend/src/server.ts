import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { 
  saveContactMessage, 
  getContactMessages,
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  likeProject, 
  getBlogs, 
  addBlog, 
  updateBlog, 
  deleteBlog, 
incrementPageViews,
  getAnalyticsSummary,
  incrementResumeDownloads,
  isDatabaseMocked
} from './firebase';
import { sendEmailNotification, sendResumeDownloadNotification } from './nodemailer';

// Load our environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
/* Secrets come only from the environment.

   An earlier version fell back to a password and signing key committed in this
   file. Because the repository is public, that fallback was a live admin
   login for anyone who read the source. There is no default now: in production
   the process refuses to start, and only `npm run dev` gets a generated
   throwaway pair so local work still runs without setup. */
const isProduction = process.env.NODE_ENV === 'production';

function requireSecret(name: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;

  if (isProduction) {
    console.error(`[Config] FATAL: ${name} is not set. Refusing to start in production.`);
    process.exit(1);
  }

  /* Dev-only: random per boot, so nothing here is ever a real credential. */
  console.warn(`[Config] ${name} is unset. Using a random development-only value.`);
  return require('crypto').randomBytes(32).toString('hex');
}

const JWT_SECRET = requireSecret('JWT_SECRET');
const ADMIN_PASSWORD = requireSecret('ADMIN_PASSWORD');

/* Origin allowlist.

   Every entry may be an exact origin or contain `*` as a whole-label wildcard,
   e.g. `https://*.vercel.app`. Matching is anchored and `*` never crosses a
   `/`, so a pattern cannot be widened into matching an arbitrary path.

   FRONTEND_URL is a comma-separated list appended to the defaults, which keeps
   the deployed service working even when the env var is absent or stale. */
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ashwanikumar.dev',
  'https://www.ashwanikumar.dev',
  'https://portfolio-ashwani.vercel.app',
];

/* Vercel issues a fresh hostname per preview deploy (`<project>-<hash>-<team>.vercel.app`),
   so pinning each one is impossible; a wildcard covers previews without opening
   the API to arbitrary third-party sites. */
const PREVIEW_ORIGIN_PATTERNS = ['https://*.vercel.app'];

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];

const allowedPatterns = [
  ...new Set([...DEFAULT_ALLOWED_ORIGINS, ...PREVIEW_ORIGIN_PATTERNS, ...envOrigins]),
];

/* Vite hands out the next free port when 5173 is busy and `vite preview` uses
   4173, so a fixed list of development ports blocks ordinary local work. Only
   loopback is matched, never a remote host. */
const LOOPBACK_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

function patternToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .split('*')
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^/]*');
  return new RegExp(`^${escaped}$`);
}

function isAllowedOrigin(origin: string): boolean {
  // Normalize: strip trailing slash.
  const normalizedOrigin = origin.replace(/\/$/, '');
  if (LOOPBACK_ORIGIN.test(normalizedOrigin)) return true;
  return allowedPatterns.some(
    pattern => pattern === '*' || patternToRegExp(pattern).test(normalizedOrigin),
  );
}

console.log('[CORS] Allowed origin patterns:', allowedPatterns);
console.log('[CORS] Any loopback port is allowed (dev).');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps, curl)
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      /* Refuse by returning "no CORS headers" rather than callback(new Error()).
         Passing an Error makes cors() delegate to the next error handler, which
         answers 500 with an HTML stack trace and, critically, without the
         Access-Control-Allow-Origin header. The browser then reports the
         confusing "Response to preflight request doesn't pass access control
         check" instead of a plain refusal. callback(null, false) is the
         documented way to deny, and it still logs the offending origin. */
      console.warn(
        `[CORS] Blocked request from origin: ${origin}. ` +
        `Add it to FRONTEND_URL (comma-separated; '*' allowed as a whole-label wildcard).`,
      );
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Cannot be true while origins are an explicit allowlist: the spec forbids
  // combining credentialed requests with a wildcard, and browsers reject the
  // response outright. The site is token-authenticated, not cookie-based, so
  // nothing here needs credentials.
  credentials: false,
  optionsSuccessStatus: 204
}));

/* No separate app.options('*', cors()) handler.

   app.use(cors()) above already answers preflights for every route, including
   ones with no explicit OPTIONS handler. Adding a second cors() here ran with
   default options, whose origin is '*', and it overwrote the allowlist
   decision: a blocked origin received Access-Control-Allow-Origin: * and was
   let through. Two handlers meant the strict one was pointless. */

app.use(express.json());

// -------------------------------------------------------------
// Authentication Middleware
// -------------------------------------------------------------

interface CustomRequest extends Request {
  admin?: any;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No session token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Session token has expired or is invalid. Please log in again.' });
  }
};

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: 'Please enter your password.' });
    return;
  }

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Incorrect password. Access denied.' });
    return;
  }

  // Password matches! Generate JWT token valid for 7 days
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ success: true, token });
});

// -------------------------------------------------------------
// Base Check & Contact Form
// -------------------------------------------------------------

app.get('/api', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    message: 'Welcome to Ashwani Kumar\'s portfolio backend API service.',
    timestamp: new Date()
  });
});

app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Please provide a valid name.' });
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({ error: 'Please write a message before submitting.' });
      return;
    }

    /* Refuse rather than accept-and-drop. In mock mode a write only lands in an
       in-memory array that a restart discards, so a 200 here would tell the
       visitor their message arrived when it did not. */
    if (isDatabaseMocked()) {
      console.error('[Contact] Rejected: no Firebase service account, message would not be saved.');
      res.status(503).json({
        error: 'The contact service is temporarily unable to store messages. Please email me directly instead.'
      });
      return;
    }

    // 1. Save to Firestore DB
    const result = await saveContactMessage(name.trim(), email.trim(), message.trim());

    // 2. Dispatch Email alert asynchronously (non-blocking)
    sendEmailNotification(name.trim(), email.trim(), message.trim());

    res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your message was received successfully.',
      id: result.id
    });
  } catch (error: any) {
    console.error('[API Error] Failed to process contact request:', error);
    res.status(500).json({
      error: 'Ah, sorry! Something went wrong on our end while processing your message.'
    });
  }
});

app.get('/api/messages', authMiddleware, async (req: Request, res: Response) => {
  try {
    const messages = await getContactMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

// -------------------------------------------------------------
// Projects CRUD Routes
// -------------------------------------------------------------

app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const list = await getProjects();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

app.post('/api/projects', authMiddleware, async (req: Request, res: Response) => {
  try {
    const projectId = await addProject(req.body);
    res.status(201).json({ success: true, id: projectId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const ok = await updateProject(req.params.id, req.body);
    if (ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Project not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const ok = await deleteProject(req.params.id);
    if (ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Project not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

app.post('/api/projects/:id/like', async (req: Request, res: Response) => {
  try {
    await likeProject(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record like.' });
  }
});

// -------------------------------------------------------------
// Blogs CRUD Routes
// -------------------------------------------------------------

app.get('/api/blogs', async (req: Request, res: Response) => {
  try {
    const list = await getBlogs();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});

app.post('/api/blogs', authMiddleware, async (req: Request, res: Response) => {
  try {
    const blogId = await addBlog(req.body);
    res.status(201).json({ success: true, id: blogId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post.' });
  }
});

app.put('/api/blogs/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const ok = await updateBlog(req.params.id, req.body);
    if (ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Blog post not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post.' });
  }
});

app.delete('/api/blogs/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const ok = await deleteBlog(req.params.id);
    if (ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Blog post not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post.' });
  }
});

// -------------------------------------------------------------
// Analytics Summary & Record Hit
// -------------------------------------------------------------

app.get('/api/analytics', async (req: Request, res: Response) => {
  try {
    const summary = await getAnalyticsSummary();
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analytics.' });
  }
});

app.post('/api/analytics/hit', async (req: Request, res: Response) => {
  try {
    const count = await incrementPageViews();
    res.status(200).json({ success: true, views: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record page view.' });
  }
});

app.post('/api/resume/download', async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown IP';
    await incrementResumeDownloads();
    sendResumeDownloadNotification(userAgent, ip);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[API Error] Resume download tracking failed:', error);
    res.status(500).json({ error: 'Failed to record resume download.' });
  }
});

// Let's fire up this server!
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Portfolio backend server is humming along nicely!`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
