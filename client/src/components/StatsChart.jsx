import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const mins = payload[0].value;
  const hrs = (mins / 60).toFixed(1);
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-green-400 font-semibold font-mono">
        {mins} min {mins >= 60 ? `(${hrs}h)` : ""}
      </p>
      <p className="text-gray-500">
        {payload[0].payload.sessionCount} session
        {payload[0].payload.sessionCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function StatsChart({ data, days }) {
  // Format date labels — show only every 5th for 30d, every 10th for 90d
  const step = days >= 60 ? 10 : 5;
  const formatted = data.map((d, i) => ({
    ...d,
    label:
      i % step === 0
        ? new Date(d.date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })
        : "",
  }));

  return (
    <div className="w-full h-48 overflow-visible min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formatted}
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}m`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="totalMinutes"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#focusGrad)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "#22c55e",
              stroke: "#111827",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
