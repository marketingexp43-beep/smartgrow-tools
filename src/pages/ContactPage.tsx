import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { SeoHead, SITE_URL } from '../components/SeoHead';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Tool Feedback');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setError('Please write a message of at least 10 characters.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setTopic('Tool Feedback');
    setMessage('');
    setError('');
    setSubmitted(false);
  };

  const origin = SITE_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact SmartGrow Tools',
    url: `${origin}/contact`,
    description:
      'Get in touch with the SmartGrow Tools team to report an issue, suggest a new marketing utility, or ask a question.',
  };

  return (
    <>
      <SeoHead
        title="Contact SmartGrow Tools – Feedback & Tool Suggestions"
        description="Get in touch with the SmartGrow Tools team to report an issue, suggest a new marketing utility, or ask a question."
        path="/contact"
        structuredData={structuredData}
      />

      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-blue-700 mb-2">Contact Us</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Share Feedback or Suggest a Tool
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Have a suggestion for a new marketing calculator, found an edge case in a counter, or want to reach our editorial team? Send us a note below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            {submitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Message Prepared Successfully
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, {name}. Your inquiry regarding <span className="font-medium text-slate-800">{topic}</span> has been validated locally. You can also email us directly anytime using the address on the right.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <a
                    href={`mailto:hello@smartgrowtools.com?subject=${encodeURIComponent(
                      `[SmartGrow Tools] ${topic}`
                    )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Open in Email Client
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <h2 className="font-display text-lg font-bold text-slate-900">Send a Message</h2>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Tool Feedback">Tool Feedback</option>
                    <option value="New Tool Request">New Tool Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Editorial / General">Editorial / General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are working on or how we can improve a tool..."
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  Submit Message
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">Direct Email</h2>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                For editorial corrections, privacy questions, or tool suggestions:
              </p>
              <a
                href="mailto:hello@smartgrowtools.com"
                className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline"
              >
                hello@smartgrowtools.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
