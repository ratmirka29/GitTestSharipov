import React, { useState, useCallback, useMemo } from 'react';
import { makeTSP } from '../problems/tsp.js';
import { useAnnealing } from './useAnnealing.js';
import Controls from './Controls.jsx';
import MiniChart from './MiniChart.jsx';

const W = 460, H = 360;

function randomCities(n) {
  return Array.from({ length: n }, () => ({
    x: 30 + Math.random() * (W - 60),
    y: 30 + Math.random() * (H - 60),
  }));
}

export default function TSPView() {
  const [cities, setCities] = useState(() => randomCities(15));

  const params = useMemo(() => ({
    tStart: 50, tEnd: 0.01, alpha: 0.9985, stepsPerTemp: 1,
  }), []);

  const build = useCallback(() => makeTSP(cities), [cities]);
  const { snap, running, history, speed, setSpeed, start, pause, reset } =
    useAnnealing(build, params, [cities]);

  const addCity = (e) => {
    if (running) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setCities((c) => c.concat({ x, y }));
  };

  const order = snap?.current ?? [];
  const routePath = order.length
    ? order.map((ci, i) => `${i === 0 ? 'M' : 'L'}${cities[ci].x},${cities[ci].y}`).join(' ') +
      ` L${cities[order[0]].x},${cities[order[0]].y}`
    : '';

  return (
    <div className="layout">
      <div className="canvas-col">
        <div className="hint">Кликни по полю, чтобы добавить город (на паузе)</div>
        <svg viewBox={`0 0 ${W} ${H}`} className="stage" onClick={addCity}>
          <path d={routePath} fill="none" stroke="var(--accent)" strokeWidth="1.6"
                strokeLinejoin="round" opacity="0.9" />
          {cities.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r="5.5" className="city" />
              {i === order[0] && <circle cx={c.x} cy={c.y} r="9" className="city-start" />}
            </g>
          ))}
        </svg>
        <div className="btn-row">
          <button className="btn btn-ghost" disabled={running}
                  onClick={() => setCities(randomCities(15))}>Случайные 15</button>
          <button className="btn btn-ghost" disabled={running}
                  onClick={() => setCities(randomCities(30))}>Случайные 30</button>
          <button className="btn btn-ghost" disabled={running}
                  onClick={() => setCities([])}>Очистить</button>
        </div>
      </div>

      <div className="side-col">
        <Controls {...{ snap, running, speed, setSpeed, start, pause, reset }} />
        <MiniChart title="Длина маршрута (энергия)"
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
