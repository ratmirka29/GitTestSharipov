import React from 'react';

// Простой SVG-линейный график без внешних библиотек.
// series: [{ values: number[], color, label }], общая ось X = индекс.
export default function MiniChart({ series, height = 140, title }) {
  const width = 460;
  const pad = 6;

  let min = Infinity;
  let max = -Infinity;
  let maxLen = 0;
  for (const s of series) {
    maxLen = Math.max(maxLen, s.values.length);
    for (const v of s.values) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!isFinite(min)) { min = 0; max = 1; }
  if (min === max) { max = min + 1; }

  const x = (i) => pad + (maxLen <= 1 ? 0 : (i / (maxLen - 1)) * (width - 2 * pad));
  const y = (v) => pad + (1 - (v - min) / (max - min)) * (height - 2 * pad);

  const toPath = (vals) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  return (
    <div className="chart">
      <div className="chart-title">{title}</div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="chart-svg">
        {series.map((s, idx) => (
          <path key={idx} d={toPath(s.values)} fill="none" stroke={s.color} strokeWidth="2" />
        ))}
      </svg>
      <div className="chart-legend">
        {series.map((s, idx) => (
          <span key={idx} className="legend-item">
            <span className="legend-dot" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
