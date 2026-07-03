import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { sendContactMessage } from '../../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setFeedbackMsg('Oops! Please fill in all the form fields before sending.');
      return;
    }

    if (!email.includes('@')) {
      setStatus('error');
      setFeedbackMsg('Wait! That email looks a bit odd. Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    setFeedbackMsg('');

    const result = await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

    if (result.success) {
      setStatus('success');
      setFeedbackMsg(result.message);
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus('error');
      setFeedbackMsg(result.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') {
      setStatus('idle');
      setFeedbackMsg('');
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-3">Get In <span className="gradient-text">Touch</span></h2>
          <p className="text-text-secondary text-[1.1rem] max-w-[600px] mx-auto">Have an open role, project inquiry, or just want to connect? Send a message!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Info Panel */}
          <div className="glass-card p-10 flex flex-col gap-6">
            <h3 className="font-heading text-xl font-bold text-text-primary border-b border-border-color pb-3">Contact Information</h3>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed">
              Feel free to reach out directly via email, phone, or by submitting the contact form. 
              I typically reply within 24 hours.
            </p>

            <div className="flex flex-col gap-5 mt-4">
              <a href="mailto:akumarclash1@gmail.com" className="flex items-center gap-4 text-text-secondary hover:text-text-primary transition-colors duration-300 no-underline">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-color-primary flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[0.8rem] text-text-muted font-medium">Email Me</p>
                  <p className="font-heading font-semibold text-text-primary text-[0.95rem] mt-0.5">akumarclash1@gmail.com</p>
                </div>
              </a>

              <a href="tel:+917644059802" className="flex items-center gap-4 text-text-secondary hover:text-text-primary transition-colors duration-300 no-underline">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-color-primary flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[0.8rem] text-text-muted font-medium">Call Me</p>
                  <p className="font-heading font-semibold text-text-primary text-[0.95rem] mt-0.5">+91-7644059802</p>
                </div>
              </a>

              <div className="flex items-center gap-4 text-text-secondary no-underline">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-color-primary flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[0.8rem] text-text-muted font-medium">Location</p>
                  <p className="font-heading font-semibold text-text-primary text-[0.95rem] mt-0.5">Kolkata, West Bengal, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Interactive Form */}
          <div className="glass-card p-10 flex flex-col gap-6">
            <h3 className="font-heading text-xl font-bold text-text-primary border-b border-border-color pb-3">Send a Message</h3>

            {/* Status alerts rendering */}
            {status === 'success' && (
              <div className="flex items-start gap-3 p-4 rounded-xl mb-4 bg-emerald-500/10 border border-emerald-500/20 text-color-primary animate-fade-in">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <p className="flex-1 text-sm">{feedbackMsg}</p>
                <button onClick={() => setStatus('idle')} className="ml-auto text-xs font-bold underline cursor-pointer hover:no-underline">
                  Write Another
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-start gap-3 p-4 rounded-xl mb-4 bg-red-500/10 border border-red-500/20 text-red-500 animate-fade-in">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{feedbackMsg}</p>
              </div>
            )}

            {status !== 'success' && (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-bold text-text-muted tracking-wide uppercase">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)] disabled:opacity-50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-bold text-text-muted tracking-wide uppercase">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)] disabled:opacity-50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-bold text-text-muted tracking-wide uppercase">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Hey Ashwani, I'd like to talk about..."
                    disabled={status === 'sending'}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-border-color rounded-lg text-text-primary text-[0.95rem] outline-none transition-all duration-300 hover:border-color-primary/40 focus:border-color-primary focus:shadow-[0_0_10px_rgba(82,196,141,0.15)] disabled:opacity-50"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full py-3.5 mt-2 flex justify-center items-center gap-2"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <span>Sending Message...</span>
                      <Loader size={18} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
