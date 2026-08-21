import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  // 1. Attempt writing to local Express backend API (with 8s timeout)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Success! Your message was delivered.',
        id: result.id,
      };
    }
  } catch (backendError) {
    console.log('[API Service] Backend unreachable or timed out. Falling back to direct Firebase write.', backendError);
  }

  // 2. Fallback: Write directly to Firebase Firestore using client Web SDK
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: serverTimestamp(),
    });

    console.log('[Firestore Client] ✅ Saved message successfully to Firestore collection:', docRef.id);
    return {
      success: true,
      message: 'Success! Your message has been saved directly to Firestore database.',
      id: docRef.id,
    };
  } catch (firestoreError: any) {
    console.error('[Firestore Client] ❌ Direct write failed:', firestoreError);
    return {
      success: false,
      message: 'Unable to send your message. Please email me directly at akumarclash1@gmail.com',
      error: firestoreError.toString(),
    };
  }
}

export async function fetchContactMessages(token: string): Promise<any[]> {
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

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
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
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// -------------------------------------------------------------
// Projects CRUD Endpoints
// -------------------------------------------------------------

export async function fetchProjects(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects list.');
    return await response.json();
  } catch (error) {
    console.error('[API Service] Failed to fetch projects:', error);
    return [];
  }
}

export async function createProject(project: any, token: string): Promise<boolean> {
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

export async function updateProject(id: string, project: any, token: string): Promise<boolean> {
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

export async function fetchBlogs(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/blogs`);
    if (!response.ok) throw new Error('Failed to fetch blog list.');
    return await response.json();
  } catch (error) {
    console.error('[API Service] Failed to fetch blog articles:', error);
    return [];
  }
}

export async function createBlog(blog: any, token: string): Promise<boolean> {
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

export async function updateBlog(id: string, blog: any, token: string): Promise<boolean> {
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

export async function fetchAnalytics(): Promise<{ views: number; projectsCount: number; blogsCount: number } | null> {
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
  } catch (e) {
    return false;
  }
}

