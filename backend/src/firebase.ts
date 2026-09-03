import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load our environment variables
dotenv.config();

console.log('[Firebase Setup] Initializing Firebase Admin SDK...');

let db: admin.firestore.Firestore | null = null;
let isMockMode = false;

// Mock Memory Data (Developer Fallback for quick local tests)
let mockProjects: any[] = [
  {
    id: 'gdocs',
    title: 'Google Docs Clone',
    subtitle: 'Real-time Collaborative Document Editor',
    description: 'A collaborative real-time text document workspace supporting concurrent multi-user editing, live presence sync, and multi-format export capabilities.',
    tech: ['React.js', 'TypeScript', 'Convex', 'Clerk', 'Liveblocks'],
    github: 'https://github.com/Titansking',
    demo: '#',
    likes: 42,
    highlights: [
      'Real-Time Workspace: Built a real-time collaborative document workspace supporting concurrent sessions for up to 50 active users with low-latency state synchronization (<50ms).',
      'Presence & RBAC: Integrated Liveblocks WebSocket pipelines for live presence and cursor tracking, implementing Clerk for secure role-based access control (RBAC).',
      'Rich-Text Editing: Implemented dynamic rich-text editing controls, structured tables, asset uploads, and multi-format document exporting (PDF, HTML, TXT, JSON).'
    ]
  },
  {
    id: 'taskflow',
    title: 'Task Flow',
    subtitle: 'Project Management Platform',
    description: 'A high-throughput Kanban project management platform designed for agile teams, featuring stateless auth guards and cross-device responsiveness.',
    tech: ['React.js', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    github: 'https://github.com/Titansking',
    demo: 'https://task-flow-ivory-five.vercel.app/',
    likes: 28,
    highlights: [
      'High-Throughput REST API: Designed a high-throughput REST API with an optimized MongoDB schema, handling 200+ requests per minute under concurrent load.',
      'Responsive Kanban Dashboard: Constructed a cross-device responsive Kanban dashboard using TypeScript to eliminate runtime bugs and standardize end-to-end data schemas.',
      'Stateless JWT Security: Secured endpoints using stateless JWT session management and Bcrypt hashing, protecting state mutation routes with custom auth guards.'
    ]
  }
];

let mockBlogs: any[] = [
  {
    id: 'post-1',
    title: 'Refactoring React Components for Speed',
    excerpt: 'How we optimized rendering performance by 40% using memoization and custom hooks.',
    content: 'In production systems, heavy render cycles degrade UX. By utilizing React.memo, useMemo, and optimizing our context state dispatches, we managed to speed up initial load times significantly. Focus on keeping states local and avoiding re-renders.',
    date: '2026-04-15',
    readTime: '5 min read'
  },
  {
    id: 'post-2',
    title: 'Building Real-time Collab with Liveblocks & Convex',
    excerpt: 'My architectural choices and learnings from building a fully featured Google Docs clone.',
    content: 'Real-time document collaboration requires strict synchrony. In this article, I discuss how Liveblocks provides high-speed presence sync, while Convex handles persistent document states with zero-config database schemas and reactive queries.',
    date: '2026-03-10',
    readTime: '8 min read'
  }
];

let mockViews = 152;
let mockResumeDownloads = 4;
let mockMessages: any[] = [
  {
    id: 'msg-1',
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hey Ashwani, I really like your portfolio! Let us discuss opportunities.',
    createdAt: new Date(Date.now() - 3600000 * 24)
  }
];

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('[Firebase Setup] ✅ Firebase Admin SDK initialized successfully with service account.');
  } else {
    isMockMode = true;
    console.log('--------------------------------------------------------------------');
    console.log('⚠️  DEVELOPER WARNING: FIREBASE_SERVICE_ACCOUNT_KEY was not found or invalid.');
    console.log('👉 Running in MOCK mode. Database changes will update inside memory arrays.');
    console.log('--------------------------------------------------------------------');
  }
} catch (error) {
  console.error('[Firebase Setup] ❌ Error initializing Firebase Admin:', error);
  isMockMode = true;
  console.log('[Firebase Setup] Falling back to MOCK mode.');
}

// -------------------------------------------------------------
// Contact Messages CRUD
// -------------------------------------------------------------

export async function saveContactMessage(name: string, email: string, message: string): Promise<{ success: boolean; id: string }> {
  const timestamp = new Date();

  if (isMockMode || !db) {
    const id = 'mock-msg-' + Date.now();
    mockMessages.push({ id, name, email, message, createdAt: timestamp });
    console.log(`[MOCK FIREBASE] ✅ Saved contact lead: ${name} <${email}>`);
    return { success: true, id };
  }

  const docRef = await db.collection('messages').add({
    name,
    email,
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { success: true, id: docRef.id };
}

export async function getContactMessages(): Promise<any[]> {
  if (isMockMode || !db) {
    return [...mockMessages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const snapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
    };
  });
}

// -------------------------------------------------------------
// Projects CRUD
// -------------------------------------------------------------

export async function getProjects(): Promise<any[]> {
  if (isMockMode || !db) {
    return mockProjects;
  }

  const snapshot = await db.collection('projects').get();
  if (snapshot.empty) {
    // If database is empty, seed defaults
    console.log('[Firestore] Seeding default projects...');
    for (const p of mockProjects) {
      const { id, ...data } = p;
      await db.collection('projects').doc(id).set(data);
    }
    return mockProjects;
  }

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addProject(project: any): Promise<string> {
  if (isMockMode || !db) {
    const id = 'mock-proj-' + Date.now();
    mockProjects.push({ id, likes: 0, ...project });
    return id;
  }

  const docRef = await db.collection('projects').add({
    likes: 0,
    ...project
  });
  return docRef.id;
}

export async function updateProject(id: string, project: any): Promise<boolean> {
  if (isMockMode || !db) {
    const idx = mockProjects.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockProjects[idx] = { ...mockProjects[idx], ...project };
      return true;
    }
    return false;
  }

  await db.collection('projects').doc(id).update(project);
  return true;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isMockMode || !db) {
    const idx = mockProjects.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockProjects.splice(idx, 1);
      return true;
    }
    return false;
  }

  await db.collection('projects').doc(id).delete();
  return true;
}

export async function likeProject(id: string): Promise<boolean> {
  if (isMockMode || !db) {
    const idx = mockProjects.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockProjects[idx].likes = (mockProjects[idx].likes || 0) + 1;
      return true;
    }
    return false;
  }

  const docRef = db.collection('projects').doc(id);
  await docRef.update({
    likes: admin.firestore.FieldValue.increment(1)
  });
  return true;
}

// -------------------------------------------------------------
// Blogs CRUD
// -------------------------------------------------------------

export async function getBlogs(): Promise<any[]> {
  if (isMockMode || !db) {
    return mockBlogs;
  }

  const snapshot = await db.collection('blogs').orderBy('date', 'desc').get();
  if (snapshot.empty) {
    console.log('[Firestore] Seeding default blog articles...');
    for (const b of mockBlogs) {
      const { id, ...data } = b;
      await db.collection('blogs').doc(id).set(data);
    }
    return mockBlogs;
  }

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addBlog(blog: any): Promise<string> {
  const dateStr = new Date().toISOString().split('T')[0];
  if (isMockMode || !db) {
    const id = 'mock-blog-' + Date.now();
    mockBlogs.unshift({ id, date: dateStr, ...blog });
    return id;
  }

  const docRef = await db.collection('blogs').add({
    date: dateStr,
    ...blog
  });
  return docRef.id;
}

export async function updateBlog(id: string, blog: any): Promise<boolean> {
  if (isMockMode || !db) {
    const idx = mockBlogs.findIndex(b => b.id === id);
    if (idx !== -1) {
      mockBlogs[idx] = { ...mockBlogs[idx], ...blog };
      return true;
    }
    return false;
  }

  await db.collection('blogs').doc(id).update(blog);
  return true;
}

export async function deleteBlog(id: string): Promise<boolean> {
  if (isMockMode || !db) {
    const idx = mockBlogs.findIndex(b => b.id === id);
    if (idx !== -1) {
      mockBlogs.splice(idx, 1);
      return true;
    }
    return false;
  }

  await db.collection('blogs').doc(id).delete();
  return true;
}

// -------------------------------------------------------------
// Analytics
// -------------------------------------------------------------

export async function incrementPageViews(): Promise<number> {
  if (isMockMode || !db) {
    mockViews += 1;
    return mockViews;
  }

  const docRef = db.collection('analytics').doc('summary');
  const doc = await docRef.get();
  
  if (!doc.exists) {
    await docRef.set({ views: 1 });
    return 1;
  }

  await docRef.update({
    views: admin.firestore.FieldValue.increment(1)
  });
  const updatedDoc = await docRef.get();
  return updatedDoc.data()?.views || 1;
}

export async function getAnalyticsSummary(): Promise<{ views: number; projectsCount: number; blogsCount: number; resumeDownloads: number }> {
  if (isMockMode || !db) {
    return {
      views: mockViews,
      projectsCount: mockProjects.length,
      blogsCount: mockBlogs.length,
      resumeDownloads: mockResumeDownloads
    };
  }

  const summaryDoc = await db.collection('analytics').doc('summary').get();
  const data = summaryDoc.data();
  const views = summaryDoc.exists ? (data?.views || 0) : 0;
  const resumeDownloads = summaryDoc.exists ? (data?.resumeDownloads || 0) : 0;
  
  const projectsSnap = await db.collection('projects').get();
  const blogsSnap = await db.collection('blogs').get();

  return {
    views,
    projectsCount: projectsSnap.size,
    blogsCount: blogsSnap.size,
    resumeDownloads
  };
}

export async function incrementResumeDownloads(): Promise<number> {
  if (isMockMode || !db) {
    mockResumeDownloads += 1;
    return mockResumeDownloads;
  }

  const docRef = db.collection('analytics').doc('summary');
  const doc = await docRef.get();
  
  if (!doc.exists) {
    await docRef.set({ resumeDownloads: 1 });
    return 1;
  }

  await docRef.update({
    resumeDownloads: admin.firestore.FieldValue.increment(1)
  });
  const updatedDoc = await docRef.get();
  return updatedDoc.data()?.resumeDownloads || 1;
}

