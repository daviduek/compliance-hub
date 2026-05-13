import type { RiskBand } from "@/lib/types";

const COLORS: Record<RiskBand, string> = {
  bajo: "var(--success)",
  medio: "var(--warning)",
  alto: "var(--danger)",
  critico: "var(--danger)",
};

const BAND_LABEL: Record<RiskBand, string> = {
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
  critico: "Crítico",
};

export function RiskGauge({
  score,
  band,
  size = 132,
}: {
  score: number;
  band: RiskBand;
  size?: number;
}) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // Semicircle: arc length = π * r. Map score 0-100 → 0..arcLen
  const arcLen = Math.PI * radius;
  const filled = Math.min(100, Math.max(0, score)) / 100;
  const color = COLORS[band];

  // Path for top semicircle (left to right)
  const path = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  return (
    <div className="inline-flex flex-col items-center select-none">
      <svg width={size} height={size / 2 + 14} viewBox={`0 0 ${size} ${size / 2 + 14}`}>
        {/* Track */}
        <path d={path} fill="none" stroke="var(--border)" strokeWidth={stroke} strokeLinecap="round" />
        {/* Filled */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen * filled} ${arcLen}`}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" className="font-mono tabular-nums" style={{ fontSize: 26, fontWeight: 500, fill: "var(--text)" }}>
          {score}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 10, fill: "var(--text-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          / 100
        </text>
      </svg>
      <div className="text-xs font-medium" style={{ color }}>{BAND_LABEL[band]}</div>
    </div>
  );
}
