import React, { useCallback, useMemo } from 'react';
import { makeFunction1D } from '../problems/func1d.js';
import { useAnnealing } from './useAnnealing.js';
import Controls from './Controls.jsx';
import MiniChart from './MiniChart.jsx';

const W = 460, H = 360;

export default function FunctionView() {
  const problem = useMemo(() => makeFunction1D(), []);
  const { f, xMin, xMax } = problem;

  const params = useMemo(() => ({
    tStart: 8, tEnd: 0.001, alpha: 0.997, stepsPerTemp: 1,
  }), []);

  const build = useCallback(() => makeFunction1D(), []);
  const { snap, running, history, speed, setSpeed, start, pause, reset } =
    useAnnealing(build, params, []);

  // Кривая функции
  const N = 300;
  let fMin = Infinity, fMax = -Infinity;
  const samples = [];
  for (let i = 0; i <= N; i++) {
    const x = xMin + (i / N) * (xMax - xMin);
    const y = f(x);
    samples.push({ x, y });
    if (y < fMin) fMin = y;
    if (y > fMax) fMax = y;
  }
  const sx = (x) => 20 + ((x - xMin) / (xMax - xMin)) * (W - 40);
  const sy = (y) => 20 + (1 - (y - fMin) / (fMax - fMin)) * (H - 40);

  const curve = samples.map((s, i) => `${i === 0 ? 'M' : 'L'}${sx(s.x).toFixed(1)},${sy(s.y).toFixed(1)}`).join(' ');

  const cx = snap ? sx(snap.current) : null;
  const cy = snap ? sy(snap.currentE) : null;
  const bx = snap ? sx(snap.best) : null;
  const by = snap ? sy(snap.bestE) : null;

  return (
    <div className="layout">
      <div className="canvas-col">
        <div className="hint">Точка ищет глобальный минимум «колючей» функции f(x) = sin x + sin 2.3x + cos 3.7x</div>
        <svg viewBox={`0 0 ${W} ${H}`} className="stage">
          <path d={curve} fill="none" stroke="var(--muted)" strokeWidth="1.6" />
          {bx != null && (
            <g>
              <line x1={bx} y1="16" x2={bx} y2={H - 16} stroke="var(--good)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              <circle cx={bx} cy={by} r="6" className="best-pt" />
            </g>
          )}
          {cx != null && <circle cx={cx} cy={cy} r="6.5" className="walker" />}
        </svg>
        <div className="legend-row">
          <span><span className="legend-dot" style={{ background: 'var(--accent)' }} /> текущая точка</span>
          <span><span className="legend-dot" style={{ background: 'var(--good)' }} /> найденный минимум</span>
        </div>
      </div>

      <div className="side-col">
        <Controls {...{ snap, running, speed, setSpeed, start, pause, reset }} />
        <MiniChart title="Значение функции (энергия)"
          series={[
            { values: history.map((h) => h.e), color: 'var(--accent)', label: 'текущая' },
            { values: history.map((h) => h.bestE), color: 'var(--good)', label: 'лучшая' },
          ]} />
        <MiniChart title="Температура"
          series={[{ values: history.map((h) => h.T), color: 'var(--warm)', label: 'T' }]} />
      </div>
    </div>
  );
}
