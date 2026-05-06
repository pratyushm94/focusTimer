// Circular SVG progress ring around the timer display
export default function TimerRing({ progress, phase, children }) {
  const R = 110;
  const C = 2 * Math.PI * R;
  const offset = C - (progress / 100) * C;

  const ringColor =
    phase === "done" ? "#4ade80" : phase === "running" ? "#22c55e" : "#374151"; // idle gray

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 260, height: 260 }}
    >
      <svg
        width="260"
        height="260"
        viewBox="0 0 260 260"
        className="absolute inset-0 -rotate-90"
      >
        {/* Background track */}
        <circle
          cx="130"
          cy="130"
          r={R}
          fill="none"
          stroke="#1f2937"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="130"
          cy="130"
          r={R}
          fill="none"
          stroke={ringColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
          }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">{children}</div>
    </div>
  );
}
