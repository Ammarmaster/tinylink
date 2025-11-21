import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function LinksTable({ links, onDelete }) {
  const navigate = useNavigate();

  function copyToClipboard(text) {
    navigator.clipboard?.writeText(text).then(() => alert('Copied'));
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-xs text-slate-200 sm:text-sm">
        <thead className="border-b border-slate-800 bg-slate-900/70">
          <tr>
            <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:px-4">
              Code
            </th>
            <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:px-4">
              URL
            </th>
            <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:px-4">
              Clicks
            </th>
            <th className="hidden px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:table-cell sm:px-4">
              Last Clicked
            </th>
            <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:px-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {links.map((l) => (
            <tr
              key={l.code}
              className="bg-slate-950/60 transition-colors hover:bg-slate-900/80"
            >
              <td className="px-3 py-3 align-middle sm:px-4">
                <button
                  type="button"
                  onClick={() => navigate(`/code/${l.code}`)}
                  className="inline-flex items-center rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-mono font-medium text-sky-300 ring-1 ring-sky-500/40 hover:bg-slate-900 hover:text-sky-100 sm:px-3"
                >
                  {l.code}
                </button>
              </td>

              <td className="px-3 py-3 align-middle sm:px-4">
                <span
                  className="block max-w-[160px] truncate text-xs text-slate-300 sm:max-w-xs sm:text-sm"
                  title={l.url}
                >
                  {l.url}
                </span>
              </td>

              <td className="px-3 py-3 text-center align-middle sm:px-4">
                <span className="inline-flex items-center justify-center rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/40 sm:px-3 sm:text-xs">
                  {l.clicks}
                </span>
              </td>

              <td className="hidden px-3 py-3 text-center align-middle sm:table-cell sm:px-4">
                <span className="text-[11px] text-slate-300 sm:text-xs">
                  {l.lastClickedAt
                    ? dayjs(l.lastClickedAt).format('YYYY-MM-DD HH:mm')
                    : '-'}
                </span>
              </td>

              <td className="px-3 py-3 text-center align-middle sm:px-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        (process.env.REACT_APP_BASE_URL ||
                          window.location.origin) +
                          '/' +
                          l.code
                      )
                    }
                    className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-100 hover:border-sky-500 hover:text-sky-200 hover:shadow-sm hover:shadow-sky-500/40 sm:px-3 sm:text-xs"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(l.code)}
                    className="inline-flex items-center rounded-full border border-red-500/60 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-100 hover:bg-red-500/20 hover:shadow-sm hover:shadow-red-500/40 sm:px-3 sm:text-xs"
                  >
                    Delete
                  </button>
                </div>

                {/* Last clicked inline on very small screens */}
                <div className="mt-2 text-[11px] text-slate-400 sm:hidden">
                  Last:{' '}
                  {l.lastClickedAt
                    ? dayjs(l.lastClickedAt).format('YYYY-MM-DD HH:mm')
                    : '-'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
