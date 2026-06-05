import React, { useState, useCallback, useMemo } from 'react';
import { makeKnapsack } from '../problems/knapsack.js';
import { useAnnealing } from './useAnnealing.js';
import Controls from './Controls.jsx';
import MiniChart from './MiniChart.jsx';

function randomItems(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    weight: 1 + Math.floor(Math.random() * 20),
    value: 1 + Math.floor(Math.random() * 20),
  }));
}

export default function KnapsackView() {
  const [items, setItems] = useState(() => randomItems(18));
  const [capacity, setCapacity] = useState(60);

  const params = useMemo(() => ({
    tStart: 60, tEnd: 0.01, alpha: 0.997, stepsPerTemp: 1,
  }), []);

  const build = useCallback(() => makeKnapsack(items, capacity), [items, capacity]);
  const { snap, running, history, speed, setSpeed, start, pause, reset } =
    useAnnealing(build, params, [items, capacity]);

  const taken = snap?.current ?? items.map(() => false);
  const problem = useMemo(() => makeKnapsack(items, capacity), [items, capacity]);
  const { weight, value } = problem.evaluate(taken);
  const fill = Math.min(1, weight / capacity);
  const over = weight > capacity;

  return (
    <div className="layout">
      <div className="canvas-col">
        <div className="hint">Алгоритм набирает предметы, максимизируя ценность при лимите веса</div>

        <div className="knap-bar">
          <div className="knap-bar-fill" style={{
            width: `${fill * 100}%`,
            background: over ? 'var(--bad)' : 'var(--good)',
          }} />
          <div className="knap-bar-label">
            Вес {weight} / {capacity} · Ценность {value}{over ? ' · ПЕРЕВЕС!' : ''}
          </div>
        </div>

        <div className="items-grid">
          {items.map((it, i) => (
            <div key={it.id} className={`item ${taken[i] ? 'item-on' : ''}`}>
              <div className="item-v">★ {it.value}</div>
              <div className="item-w">{it.weight} кг</div>
            </div>
          ))}
        </div>

        <label className="slider">
          <span>Вместимость: <b>{capacity}</b></span>
          <input type="range" min="20" max="150" value={capacity} disabled={running}
                 onChange={(e) => setCapacity(Number(e.target.value))} />
        </label>
        <div className="btn-row">
          <button className="btn btn-ghost" disabled={running}
                  onClick={() => setItems(randomItems(18))}>Новые предметы (18)</button>
          <button className="btn btn-ghost" disabled={running}
                  onClick={() => setItems(randomItems(30))}>Много (30)</button>
        </div>
      </div>

      <div className="side-col">
        <Controls {...{ snap, running, speed, setSpeed, start, pause, reset }} />
        <MiniChart title="Энергия (−ценность + штраф за перевес)"
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
