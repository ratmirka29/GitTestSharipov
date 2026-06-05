import React from 'react';

export default function Controls({ snap, running, speed, setSpeed, start, pause, reset, extra }) {
  return (
    <div className="controls">
      <div className="btn-row">
        {running ? (
          <button className="btn btn-primary" onClick={pause}>❚❚ Пауза</button>
        ) : (
          <button className="btn btn-primary" onClick={start}>▶ Запуск</button>
        )}
        <button className="btn" onClick={reset}>↻ Сброс</button>
      </div>

      <label className="slider">
        <span>Скорость: <b>{speed}</b> шаг/кадр</span>
        <input
          type="range" min="1" max="200" value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>

      {snap && (
        <div className="stats">
          <Stat label="Температура T" value={snap.T.toFixed(3)} />
          <Stat label="Энергия (тек.)" value={snap.currentE.toFixed(3)} />
          <Stat label="Лучшая энергия" value={snap.bestE.toFixed(3)} highlight />
          <Stat label="Итераций" value={snap.iteration} />
          <Stat label="Принято" value={snap.accepted} />
          <Stat label="Статус" value={snap.finished ? 'заморожено' : (running ? 'идёт' : 'пауза')} />
        </div>
      )}

      {extra}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className={`stat ${highlight ? 'stat-hl' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
