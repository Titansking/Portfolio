import { useState, useEffect } from 'react';
import { Lock, LogOut, Trash2, Edit2, Plus, Mail, MessageSquare, Briefcase, BarChart2 } from 'lucide-react';
import { 
  adminLogin, 
  fetchContactMessages, 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  fetchBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  fetchAnalytics
} from '../../services/api';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'blogs' | 'analytics'>('messages');

  // Dashboard Data State
  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Form Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '', subtitle: '', description: '', tech: '', github: '', demo: '', highlights: ''
  });
  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', readTime: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    if (!token) return;
    const [msgs, projs, posts, stats] = await Promise.all([
      fetchContactMessages(token),
      fetchProjects(),
      fetchBlogs(),
      fetchAnalytics()
    ]);
    setMessages(msgs);
    setProjects(projs);
    setBlogs(posts);
    setAnalytics(stats);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await adminLogin(password);
    if (result.success && result.token) {
      localStorage.setItem('adminToken', result.token);
      setToken(result.token);
    } else {
      setError(result.error || 'Access Denied. Check password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  // -------------------------------------------------------------
  // Project Actions
  // -------------------------------------------------------------
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      ...projectForm,
      tech: projectForm.tech.split(',').map(t => t.trim()).filter(Boolean),
      highlights: projectForm.highlights.split('\n').map(h => h.trim()).filter(Boolean)
    };

    let ok = false;
    if (editingId) {
      ok = await updateProject(editingId, payload, token);
    } else {
      ok = await createProject(payload, token);
    }

    if (ok) {
      resetProjectForm();
      loadDashboardData();
    } else {
      alert('Failed to save project document.');
    }
  };

  const startEditProject = (p: any) => {
    setEditingId(p.id);
    setProjectForm({
      title: p.title || '',
      subtitle: p.subtitle || '',
      description: p.description || '',
      tech: (p.tech || []).join(', '),
      github: p.github || '',
      demo: p.demo || '',
      highlights: (p.highlights || []).join('\n')
    });
    setShowForm(true);
  };

  const resetProjectForm = () => {
    setProjectForm({ title: '', subtitle: '', description: '', tech: '', github: '', demo: '', highlights: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!token || !window.confirm('Delete this project?')) return;
    const ok = await deleteProject(id, token);
    if (ok) loadDashboardData();
  };

  // -------------------------------------------------------------
  // Blog Actions
  // -------------------------------------------------------------
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    let ok = false;
    if (editingId) {
      ok = await updateBlog(editingId, blogForm, token);
    } else {
      ok = await createBlog(blogForm, token);
    }

    if (ok) {
      resetBlogForm();
      loadDashboardData();
    } else {
      alert('Failed to save blog post.');
    }
  };

  const startEditBlog = (b: any) => {
    setEditingId(b.id);
    setBlogForm({
      title: b.title || '',
      excerpt: b.excerpt || '',
      content: b.content || '',
      readTime: b.readTime || ''
    });
    setShowForm(true);
  };

  const resetBlogForm = () => {
    setBlogForm({ title: '', excerpt: '', content: '', readTime: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!token || !window.confirm('Delete this blog post?')) return;
    const ok = await deleteBlog(id, token);
    if (ok) loadDashboardData();
  };

  // -------------------------------------------------------------
  // Render Login Panel
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-5 mt-[60px]">
        <div className="glass-card w-full max-w-[440px] p-10 text-center flex flex-col gap-5 animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-color-primary/10 border border-color-primary/20 text-color-primary mx-auto">
            <Lock size={32} />
          </div>
          <h2 className="font-heading text-[1.8rem] font-bold text-text-primary">Admin Authentication</h2>
          <p className="text-text-secondary text-[0.95rem] leading-relaxed">Please enter the dashboard passkey to manage portfolio contents.</p>
          
          {error && <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-500 rounded-lg text-[0.9rem] font-medium">{error}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="w-full">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none text-center transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render Dashboard
  // -------------------------------------------------------------
  return (
    <div className="container mx-auto px-6 pt-[140px] pb-20">
      <div className="flex justify-between items-center mb-10 border-b border-border-color pb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-[2.2rem] font-extrabold">Admin <span className="gradient-text">Console</span></h2>
          <p className="text-text-secondary text-base mt-1">Manage projects, write blogs, and view analytical stats in real-time.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2 px-5 py-2.5 text-[0.9rem]">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Analytics Widget Row */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 flex items-center gap-5">
            <BarChart2 className="w-12 h-12 text-color-primary bg-color-primary/8 border border-border-color rounded-xl p-3 shrink-0" />
            <div>
              <h3 className="font-heading text-[1.8rem] font-bold text-text-primary leading-none">{analytics.views}</h3>
              <p className="text-text-muted text-[0.85rem] mt-1">Total Page Hits</p>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-5">
            <Briefcase className="w-12 h-12 text-color-primary bg-color-primary/8 border border-border-color rounded-xl p-3 shrink-0" />
            <div>
              <h3 className="font-heading text-[1.8rem] font-bold text-text-primary leading-none">{analytics.projectsCount}</h3>
              <p className="text-text-muted text-[0.85rem] mt-1">Active Projects</p>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-5">
            <MessageSquare className="w-12 h-12 text-color-primary bg-color-primary/8 border border-border-color rounded-xl p-3 shrink-0" />
            <div>
              <h3 className="font-heading text-[1.8rem] font-bold text-text-primary leading-none">{analytics.blogsCount}</h3>
              <p className="text-text-muted text-[0.85rem] mt-1">Blog Posts</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex gap-3 mb-8 border-b-[1.5px] border-border-color pb-3 flex-wrap">
        <button 
          onClick={() => { setActiveTab('messages'); resetProjectForm(); resetBlogForm(); }}
          className={`flex items-center gap-2 px-6 py-3 bg-transparent border-none text-text-secondary font-heading font-semibold text-[1.05rem] cursor-pointer rounded-[30px] transition-all duration-300 hover:text-color-primary hover:bg-tag-bg ${
            activeTab === 'messages' ? '!bg-gradient-brand !text-[#050806] font-bold shadow-[0_4px_15px_rgba(82,196,141,0.25)] dark:!text-[#050806] light:!text-white' : ''
          }`}
        >
          <Mail size={16} /> Messages ({messages.length})
        </button>
        <button 
          onClick={() => { setActiveTab('projects'); resetProjectForm(); }}
          className={`flex items-center gap-2 px-6 py-3 bg-transparent border-none text-text-secondary font-heading font-semibold text-[1.05rem] cursor-pointer rounded-[30px] transition-all duration-300 hover:text-color-primary hover:bg-tag-bg ${
            activeTab === 'projects' ? '!bg-gradient-brand !text-[#050806] font-bold shadow-[0_4px_15px_rgba(82,196,141,0.25)] dark:!text-[#050806] light:!text-white' : ''
          }`}
        >
          <Briefcase size={16} /> Projects ({projects.length})
        </button>
        <button 
          onClick={() => { setActiveTab('blogs'); resetBlogForm(); }}
          className={`flex items-center gap-2 px-6 py-3 bg-transparent border-none text-text-secondary font-heading font-semibold text-[1.05rem] cursor-pointer rounded-[30px] transition-all duration-300 hover:text-color-primary hover:bg-tag-bg ${
            activeTab === 'blogs' ? '!bg-gradient-brand !text-[#050806] font-bold shadow-[0_4px_15px_rgba(82,196,141,0.25)] dark:!text-[#050806] light:!text-white' : ''
          }`}
        >
          <MessageSquare size={16} /> Blog Posts ({blogs.length})
        </button>
      </div>

      {/* TAB CONTENT: Messages */}
      {activeTab === 'messages' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {messages.length === 0 ? (
            <p className="text-center padding: 48px -> py-12 text-text-muted text-lg">No contact inquiries received yet.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((msg, index) => (
                <div key={msg.id || index} className="glass-card p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-text-primary text-[1.05rem]">{msg.name}</span>
                    <span className="text-color-primary text-[0.9rem]">&lt;{msg.email}&gt;</span>
                    <span className="text-text-muted text-[0.85rem] md:ml-auto">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-text-secondary text-[0.95rem] leading-relaxed white-space-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Projects */}
      {activeTab === 'projects' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-[1.4rem] font-bold">Featured Projects List</h3>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center gap-1.5 text-[0.9rem] px-4.5 py-2.5">
                <Plus size={16} /> Add Project
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleProjectSubmit} className="glass-card p-8 mb-8 flex flex-col gap-5 animate-slide-up">
              <h3 className="font-heading text-[1.4rem] font-bold border-b border-border-color pb-3 mb-1">{editingId ? 'Edit Project Details' : 'Create New Featured Project'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Google Docs Clone"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Subtitle</label>
                  <input
                    type="text"
                    required
                    value={projectForm.subtitle}
                    onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                    placeholder="e.g. Real-time Collaboration Tool"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Summary of what the project does..."
                  className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted tracking-wide uppercase">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={projectForm.github}
                    onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Live Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.demo}
                    onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                    placeholder="#"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Technologies Utilized (Comma separated)</label>
                <input
                  type="text"
                  required
                  value={projectForm.tech}
                  onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                  placeholder="React.js, TypeScript, Convex, Liveblocks"
                  className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Highlights (One feature per line)</label>
                <textarea
                  rows={4}
                  required
                  value={projectForm.highlights}
                  onChange={(e) => setProjectForm({ ...projectForm, highlights: e.target.value })}
                  placeholder="Real-Time Sync: description&#10;Presence: cursors tracking..."
                  className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                />
              </div>
              <div className="flex gap-3 mt-3">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Publish Project'}
                </button>
                <button type="button" onClick={resetProjectForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-4">
            {projects.map((p) => (
              <div key={p.id} className="glass-card p-5 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-heading text-[1.2rem] font-bold text-text-primary">{p.title}</h4>
                  <p className="text-text-secondary text-[0.9rem] mt-0.5">{p.subtitle}</p>
                </div>
                <div className="flex gap-2.5 w-full md:w-auto md:justify-end">
                  <button onClick={() => startEditProject(p)} className="flex items-center justify-center w-9 h-9 rounded-lg bg-tag-bg border border-border-color text-text-secondary cursor-pointer transition-all duration-300 hover:border-color-primary hover:text-color-primary">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteProject(p.id)} className="flex items-center justify-center w-9 h-9 rounded-lg bg-tag-bg border border-border-color text-text-secondary cursor-pointer transition-all duration-300 hover:border-red-500 hover:text-red-500 hover:bg-red-500/5">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Blogs */}
      {activeTab === 'blogs' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-[1.4rem] font-bold">Blog Articles List</h3>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center gap-1.5 text-[0.9rem] px-4.5 py-2.5">
                <Plus size={16} /> Write Article
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleBlogSubmit} className="glass-card p-8 mb-8 flex flex-col gap-5 animate-slide-up">
              <h3 className="font-heading text-[1.4rem] font-bold border-b border-border-color pb-3 mb-1">{editingId ? 'Edit Article details' : 'Draft New Blog Article'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Refactoring React cycles"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Read Duration Time</label>
                  <input
                    type="text"
                    required
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Excerpt / Summary</label>
                <input
                  type="text"
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="One sentence summary of the article..."
                  className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted tracking-wide uppercase">Article Content (Text format)</label>
                <textarea
                  required
                  rows={8}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Main body content..."
                  className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)]"
                />
              </div>
              <div className="flex gap-3 mt-3">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Publish Article'}
                </button>
                <button type="button" onClick={resetBlogForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-4">
            {blogs.map((b) => (
              <div key={b.id} className="glass-card p-5 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-heading text-[1.2rem] font-bold text-text-primary">{b.title}</h4>
                  <p className="text-text-secondary text-[0.9rem] mt-0.5">{b.excerpt}</p>
                </div>
                <div className="flex gap-2.5 w-full md:w-auto md:justify-end">
                  <button onClick={() => startEditBlog(b)} className="flex items-center justify-center w-9 h-9 rounded-lg bg-tag-bg border border-border-color text-text-secondary cursor-pointer transition-all duration-300 hover:border-color-primary hover:text-color-primary">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteBlog(b.id)} className="flex items-center justify-center w-9 h-9 rounded-lg bg-tag-bg border border-border-color text-text-secondary cursor-pointer transition-all duration-300 hover:border-red-500 hover:text-red-500 hover:bg-red-500/5">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
