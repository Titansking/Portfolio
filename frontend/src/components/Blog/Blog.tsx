import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBlogs, type BlogPost } from '../../services/api';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // The fetch owns its own lifecycle: `active` drops the result if the
  // component unmounts mid-request, and the state updates land after an await
  // rather than synchronously inside the effect body.
  useEffect(() => {
    let active = true;
    void (async () => {
      const list = await fetchBlogs();
      if (!active) return;
      setBlogs(list);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-6">
        <p className="text-center py-12 text-text-muted text-lg">Loading articles from portfolio database...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render Detailed Article View
  // -------------------------------------------------------------
  if (selectedPost) {
    return (
      <section className="pt-[140px] pb-20 relative container mx-auto px-6 animate-fade-in">
        <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 bg-transparent border-none text-text-secondary font-heading text-[1.05rem] font-semibold cursor-pointer py-2.5 mb-6 transition-colors duration-300 hover:text-color-primary">
          <ChevronLeft size={16} /> Back to Blog Feed
        </button>

        <article className="glass-card p-12 max-w-[800px] mx-auto flex flex-col gap-8">
          <div className="border-b border-border-color pb-6 flex flex-col gap-4">
            <div className="flex gap-5 text-[0.85rem] text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {selectedPost.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {selectedPost.readTime}
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-[2.2rem] font-extrabold leading-tight">{selectedPost.title}</h2>
            <p className="text-[1.1rem] text-color-primary leading-relaxed font-medium">{selectedPost.excerpt}</p>
          </div>

          <div className="flex flex-col gap-5">
            {selectedPost.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="text-base text-text-secondary leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </article>
      </section>
    );
  }

  // -------------------------------------------------------------
  // Render Feed List View
  // -------------------------------------------------------------
  return (
    <section className="pt-[140px] pb-20 relative container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold mb-3">Developer <span className="gradient-text">Blog</span></h2>
        <p className="text-text-secondary text-[1.1rem] max-w-[600px] mx-auto">Thoughts on full-stack architecture, React performance scaling, and lessons learned from the field.</p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center py-12 text-text-muted text-lg">No blog posts published yet. Stay tuned!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {blogs.map((post) => (
            <div 
              key={post.id} 
              className="glass-card p-8 cursor-pointer flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-color-primary hover:shadow-[0_8px_30px_rgba(82,196,141,0.15)]"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex gap-4 text-xs text-text-muted items-center">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {post.readTime}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-text-primary leading-tight">{post.title}</h3>
              <p className="text-text-secondary text-[0.95rem] leading-relaxed">{post.excerpt}</p>
              
              <div className="mt-auto flex items-center gap-1.5 text-[0.9rem] font-semibold text-color-primary group">
                <span>Read Full Article</span>
                <ChevronRight size={16} className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
