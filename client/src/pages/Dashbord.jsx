import React, { useEffect, useState } from 'react';
import { listLinks, createLink, deleteLink } from '../api/api';
import AddLinkForm from '../components/AddLinkForm';
import LinksTable from '../components/LinksTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await listLinks();
      setLinks(data);
    } catch (err) {
      setError(err.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    const res = await createLink(payload);
    if (res.status === 201) {
      await load();
      return { ok: true };
    }
    if (res.status === 409) return { ok: false, error: 'Code already exists' };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.error || 'Failed' };
  }

  async function handleDelete(code) {
    if (!window.confirm('Delete this short link?')) return false;
    const res = await deleteLink(code);
    if (res.ok) {
      await load();
      return true;
    }
    alert('Failed to delete');
    return false;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      {/* top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-sky-500/30 via-slate-900/60 to-slate-950 -z-10" />

      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-3 py-4 sm:flex-row sm:items-center sm:px-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              TinyLink Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Create, manage, and track your short links in one place.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300 shadow-sm shadow-sky-500/10 sm:text-xs">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 mr-1.5" />
            API connected
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-3 py-6 sm:px-4 sm:py-8">
        {/* top summary row */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="col-span-1 rounded-2xl border border-white/5 bg-slate-900/70 p-4 shadow-lg shadow-sky-900/40 md:col-span-2">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Overview
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Quickly shorten URLs and manage them with a clean interface.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-300 ring-1 ring-sky-500/30">
                {links.length} active links
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-4 text-sm shadow-lg shadow-sky-900/40">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Status
            </p>
            <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-xs text-slate-200">
                  {loading ? 'Syncing with server…' : 'All caught up'}
                </span>
              </div>
              <button
                type="button"
                onClick={load}
                className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-200 transition-all hover:border-sky-500 hover:text-sky-200 hover:shadow-sm hover:shadow-sky-500/40"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* main content */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1.8fr)]">
          {/* create form card */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl shadow-sky-900/40 sm:p-6">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Create a new short link
                </h2>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Paste your long URL, choose a custom code, and you’re good to go.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-sky-300 ring-1 ring-sky-500/30">
                New
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 ring-1 ring-slate-800/80">
              <AddLinkForm onCreate={handleCreate} />
            </div>
          </div>

          {/* links table card */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl shadow-sky-900/40 sm:p-6">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Links
                </h2>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Manage your existing TinyLinks: copy, share, or delete.
                </p>
              </div>
              {links.length > 0 && !loading && !error && (
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300">
                  Total:{' '}
                  <span className="font-semibold text-sky-300">
                    {links.length}
                  </span>
                </span>
              )}
            </div>

            <div className="rounded-xl bg-slate-950/70 p-4 ring-1 ring-slate-800/80">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-slate-700/70" />
                  <div className="h-8 w-full animate-pulse rounded-lg bg-slate-800/80" />
                  <div className="h-8 w-full animate-pulse rounded-lg bg-slate-800/80" />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              ) : links.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No links yet.{` `}
                  <span className="font-medium text-sky-300">
                    Create your first TinyLink using the form above.
                  </span>
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-800/80 bg-slate-950/80">
                  <LinksTable links={links} onDelete={handleDelete} />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
