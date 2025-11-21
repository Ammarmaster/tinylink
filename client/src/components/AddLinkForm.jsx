import React, { useState } from 'react';

function isValidUrl(value) {
  try { new URL(value); return true; } catch (e) { return false; }
}

export default function AddLinkForm({ onCreate }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    if (!url) return setMessage({ type: 'error', text: 'URL is required' });
    if (!isValidUrl(url)) return setMessage({ type: 'error', text: 'Invalid URL' });
    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) return setMessage({ type: 'error', text: 'Code must be 6-8 alphanumeric' });
    setLoading(true);
    try {
      const result = await onCreate({ url, code: code || undefined });
      if (result.ok) {
        setMessage({ type: 'success', text: 'Created!' });
        setUrl(''); setCode('');
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed' });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
          Original URL
        </label>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
          Custom code{' '}
          <span className="font-normal normal-case text-slate-500">
            (optional, 6–8 alphanumeric)
          </span>
        </label>
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="ABC1234"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60"
        />
      </div>

      <div className="flex flex-col items-stretch gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-sky-500/40 transition-all hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-800/60 disabled:text-slate-300 sm:w-auto"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>

        {message && (
          <div
            className={`text-xs sm:text-[11px] ${
              message.type === 'error'
                ? 'text-red-300'
                : 'text-emerald-300'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </form>
  );
}
