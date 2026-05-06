export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div
      className={`rounded-xl px-4 py-3 ${accent ? "bg-green-500/10 border border-green-500/20" : "bg-gray-800/60"}`}
    >
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p
        className={`text-xl font-bold font-mono ${accent ? "text-green-400" : "text-white"}`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}
