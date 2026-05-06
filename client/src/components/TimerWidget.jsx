import TimerRing from "./TimerRing";
import { useTimer } from "../hooks/useTimer";

export default function TimerWidget({ onSessionSaved }) {
  const { minutes, seconds, progress, phase, start, stop, reset } = useTimer({
    onSessionSaved,
  });

  const phaseLabel = {
    idle: "Ready to focus",
    running: "Stay focused…",
    done: "🎉 Session complete!",
  }[phase];

  return (
    <div className="flex flex-col items-center gap-6">
      <TimerRing progress={progress} phase={phase}>
        {/* Countdown display */}
        <span
          className="font-timer text-5xl font-bold tracking-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          {minutes}:{seconds}
        </span>
        <span className="text-xs text-gray-400 mt-1 font-mono">
          30:00 session
        </span>
      </TimerRing>

      {/* Phase label */}
      <p
        className={`text-sm font-medium transition-colors duration-500 ${
          phase === "done"
            ? "text-green-400"
            : phase === "running"
              ? "text-green-300"
              : "text-gray-400"
        }`}
      >
        {phaseLabel}
      </p>

      {/* Controls */}
      <div className="flex gap-3">
        {phase === "idle" && (
          <button
            onClick={start}
            className="px-8 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-gray-950 font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-green-500/20"
          >
            Start
          </button>
        )}

        {phase === "running" && (
          <button
            onClick={stop}
            className="px-8 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm transition-all active:scale-95"
          >
            Stop & Save
          </button>
        )}

        {phase === "done" && (
          <>
            <button
              onClick={start}
              className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-gray-950 font-semibold text-sm transition-all active:scale-95"
            >
              Start again
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-all active:scale-95"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
