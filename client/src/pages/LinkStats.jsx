import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLink } from '../api/api';
import dayjs from 'dayjs';

export default function LinkStats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getLink(code);
        setLink(data);
      } catch (err) {
        setError('Not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 shadow-lg shadow-sky-900/40">
          <p className="text-center text-sm text-slate-300">Loading stats...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-4 shadow-lg shadow-red-900/40">
          <p className="text-center text-sm font-medium text-red-200">
            {error}
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 text-center sm:text-left">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            TinyLink • Analytics
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Stats for{' '}
            <span className="mt-2 inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-base font-mono text-sky-300 ring-1 ring-sky-500/40">
              {link.code}
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:max-w-xl">
            View usage details, creation time, and last activity for this short
            link.
          </p>
        </header>

        <div className="rounded-2xl border border-white/5 bg-slate-900/80 shadow-xl shadow-sky-900/40">
          <div className="border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Link details
            </p>
          </div>

          <div className="space-y-5 px-4 py-5 text-sm sm:px-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Original URL
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex break-all text-sm text-sky-300 hover:text-sky-200 hover:underline"
              >
                {link.url}
              </a>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Short link
              </p>
              <a
                href={`${
                  process.env.REACT_APP_BASE_URL || window.location.origin
                }/${link.code}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex break-all text-sm text-emerald-300 hover:text-emerald-200 hover:underline"
              >
                {(process.env.REACT_APP_BASE_URL || window.location.origin) +
                  '/' +
                  link.code}
              </a>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Clicks
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {link.clicks}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Created
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {dayjs(link.createdAt).format('YYYY-MM-DD HH:mm')}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Last clicked
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {link.lastClickedAt
                    ? dayjs(link.lastClickedAt).format('YYYY-MM-DD HH:mm')
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
