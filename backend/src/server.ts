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
  incrementResumeDownloads
} from './firebase';
import { sendEmailNotification, sendResumeDownloadNotification } from './nodemailer';

// Load our environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-ashwani-portfolio-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ashwani-admin-2026';

// Enable CORS to support multiple frontend origins (e.g. localhost, production domain, Vercel deployments)
// Always include known production origins as defaults so CORS works even if env var is misconfigured
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://portfolio--ashwani.vercel.app',
];

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];

// Merge env-based origins with hardcoded defaults (deduplicated)
const allowedOrigins = [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins])];

console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps, curl)
    if (!origin) return callback(null, true);
    // Normalize: strip trailing slash
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes('*') || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests for all routes
app.options('*', cors());

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
