const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

/* Record shapes returned by the API. The dashboard and the blog feed both
   render these directly, so they are described once here instead of being
   re-declared as `any` at every call site. Fields the backend may omit are
   optional, and the readers already guard on them. */

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  /** ISO string or epoch millis, depending on the store. */
  createdAt?: string | number;
}

export interface Project {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  highlights: string[];
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  date?: string;
}

export interface Analytics {
  views: number;
  projectsCount: number;
  blogsCount: number;
}

/** Payloads sent to create/update. Identical to the records today, but named
    separately so a future backend change has one place to land. */
export type ProjectInput = Omit<Project, 'id'>;
export type BlogInput = Omit<BlogPost, 'id' | 'date'>;

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/** Narrows an unknown catch binding to a readable message. */
function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

// Helper to compile request headers with auth token if present
const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// -------------------------------------------------------------
// Contact Inquiry Endpoints
// -------------------------------------------------------------

export async function sendContactMessage(data: ContactData): Promise<ContactResponse> {
  /* The Express backend is the only working delivery path: it validates the
     payload, writes to Firestore with admin credentials, and emails a notice.
     A browser can only report a CORS rejection as an opaque network error, so
     an origin the backend does not allow surfaces here identically to the
     backend being down. Say which one it was, otherwise the form just says
     "failed" and the real cause stays buried in the console. */
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      signal: controller.signal,
    });
  } catch (backendError) {
    clearTimeout(timeoutId);
    console.error('[API Service] Contact request never reached the backend:', backendError);
    return {
      success: false,
      message:
        'Could not reach the contact service. It may be waking up, or this page ' +
        'is not an origin the server allows. Please email me directly instead.',
      error: errorMessage(backendError),
    };
  }
  clearTimeout(timeoutId);

  if (response.ok) {
    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Success! Your message was delivered.',
      id: result.id,
    };
  }

  /* Reached the backend but it refused. Read the body for its own error text
     rather than inventing one, since it distinguishes a validation failure
     (the visitor's fault, retryable) from a 500 (our fault). */
  let detail = '';
  try {
    detail = (await response.json())?.error ?? '';
  } catch {
    // Non-JSON error body; fall through to the generic text below.
  }

  return {
    success: false,
    message:
      detail ||
      `The contact service rejected your message (HTTP ${response.status}). Please email me directly instead.`,
    error: `HTTP ${response.status}`,
  };
}

export async function fetchContactMessages(token: string): Promise<ContactMessage[]> {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch contact inquiries.');
    return await response.json();
  } catch (error) {
    console.error('[API Service] Failed to retrieve messages:', error);
    return [];
  }
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

export async function adminLogin(password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Authentication failed.');
    }
    return { success: true, token: result.token };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

// -------------------------------------------------------------
// Projects CRUD Endpoints
// -------------------------------------------------------------

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects list.');
    return await response.json();
  } catch (error) {
    console.error('[API Service] Failed to fetch projects:', error);
    return [];
  }
}

export async function createProject(project: ProjectInput, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(project),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to create project:', error);
    return false;
  }
}

export async function updateProject(id: string, project: ProjectInput, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(project),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to update project:', error);
    return false;
  }
}

export async function deleteProject(id: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to delete project:', error);
    return false;
  }
}

export async function likeProject(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/projects/${id}/like`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to register project like:', error);
    return false;
  }
}

// -------------------------------------------------------------
// Blogs CRUD Endpoints
// -------------------------------------------------------------

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_URL}/blogs`);
    if (!response.ok) throw new Error('Failed to fetch blog list.');
    return await response.json();
  } catch (error) {
    console.error('[API Service] Failed to fetch blog articles:', error);
    return [];
  }
}

export async function createBlog(blog: BlogInput, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(blog),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to create blog article:', error);
    return false;
  }
}

export async function updateBlog(id: string, blog: BlogInput, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(blog),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to update blog article:', error);
    return false;
  }
}

export async function deleteBlog(id: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to delete blog article:', error);
    return false;
  }
}

// -------------------------------------------------------------
// Analytics Endpoints
// -------------------------------------------------------------

export async function fetchAnalytics(): Promise<Analytics | null> {
  try {
    const response = await fetch(`${API_URL}/analytics`);
    if (!response.ok) throw new Error('Failed to fetch analytics.');
    return await response.json();
  } catch (error) {
    console.error('[API Service] Failed to retrieve analytics data:', error);
    return null;
  }
}

export async function recordPageHit(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/analytics/hit`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.log('[API Service] Failed to record views page hit:', error);
    return false;
  }
}

export async function trackResumeDownload(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/resume/download`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error('[API Service] Failed to record resume download metrics:', error);
    return false;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(API_URL);
    return response.ok;
  } catch {
    return false;
  }
}

