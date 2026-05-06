import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStats } from "../hooks/useStats";
import TimerWidget from "../components/TimerWidget";
import StatsChart from "../components/StatsChart";
import SessionHistory from "../components/SessionHistory";
import StatCard from "../components/StatCard";

function formatMinutes(secs) {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m}m`;
  return `${(m / 60).toFixed(1)}h`;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [days, setDays] = useState(30);
  const { stats, loading, refresh } = useStats(days);
  const [historyKey, setHistoryKey] = useState(0);

  const onSessionSaved = () => {
    refresh();
    setHistoryKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <header className="border-b border-gray-800/60 px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-lg">⏱</span>
          <span className="font-semibold text-sm text-white">FocusTimer</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Timer + today stats — two column on wide screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Timer */}
          <div className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center border border-gray-800/60">
            <TimerWidget onSessionSaved={onSessionSaved} />
          </div>

          {/* Today's stats */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Today
            </h2>
            {loading ? (
              <div className="text-gray-600 text-xs">Loading…</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  accent
                  label="Focus time"
                  value={formatMinutes(stats?.today?.totalSeconds || 0)}
                  sub="today"
                />
                <StatCard
                  label="Sessions"
                  value={stats?.today?.sessionCount || 0}
                  sub="today"
                />
                <StatCard
                  label="Streak"
                  value={`${stats?.streak || 0} day${stats?.streak !== 1 ? "s" : ""}`}
                  sub="current streak"
                />
                <StatCard
                  label="All time"
                  value={formatMinutes(stats?.allTime?.totalSeconds || 0)}
                  sub={`${stats?.allTime?.totalSessions || 0} sessions total`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Growth chart */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">
              Focus over time
            </h2>
            <div className="flex gap-1">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                    days === d
                      ? "bg-green-500/20 text-green-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          {!loading && stats?.chart ? (
            <StatsChart data={stats.chart} days={days} />
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-600 text-xs">
              Loading chart…
            </div>
          )}
        </div>

        {/* Session history */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800/60">
          <SessionHistory
            refreshKey={historyKey}
            onDeleteAll={() => {
              refresh();
            }}
          />
        </div>
      </main>
    </div>
  );
}
