import { useState, useEffect } from "react";
import api from "../api";

function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s > 0 ? `${s}s` : ""}`.trim();
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function SessionHistory({ refreshKey, onDeleteAll }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmAll, setConfirmAll] = useState(false);

  const limit = 10;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/sessions?page=${page}&limit=${limit}`)
      .then((res) => {
        setSessions(res.data.sessions);
        setTotal(res.data.pagination.total);
      })
      .finally(() => setLoading(false));
  }, [page, refreshKey]);

  const deleteOne = async (id) => {
    await api.delete(`/sessions/${id}`);
    setSessions((prev) => prev.filter((s) => s._id !== id));
    setTotal((t) => t - 1);
  };

  const deleteAll = async () => {
    await api.delete("/sessions");
    setSessions([]);
    setTotal(0);
    setConfirmAll(false);
    onDeleteAll?.();
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300">
          Session History{" "}
          <span className="text-gray-500 font-normal">({total})</span>
        </h2>
        {total > 0 && !confirmAll && (
          <button
            onClick={() => setConfirmAll(true)}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Reset all
          </button>
        )}
        {confirmAll && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Delete everything?</span>
            <button
              onClick={deleteAll}
              className="text-xs text-red-400 font-semibold hover:text-red-300"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmAll(false)}
              className="text-xs text-gray-500 hover:text-gray-400"
            >
              No
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 text-xs py-4 text-center">Loading…</div>
      ) : sessions.length === 0 ? (
        <div className="text-gray-600 text-xs py-8 text-center">
          No sessions yet. Start your first timer!
        </div>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li
              key={s._id}
              className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2.5 animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${s.completed ? "bg-green-500" : "bg-gray-500"}`}
                />
                <div>
                  <p className="text-xs text-gray-300 font-medium">
                    {formatDate(s.startTime)} · {formatTime(s.startTime)}–
                    {formatTime(s.endTime)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDuration(s.durationSeconds)}
                    {s.completed ? " · full session" : " · stopped early"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteOne(s._id)}
                className="text-gray-600 hover:text-red-400 transition-colors text-xs pl-3"
                title="Delete session"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 pt-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-700 transition"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-500 py-1">
            {page}/{pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-700 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
