import React, { useState } from 'react';
import TSPView from './components/TSPView.jsx';
import FunctionView from './components/FunctionView.jsx';
import KnapsackView from './components/KnapsackView.jsx';

const TABS = [
  { id: 'tsp', label: 'Коммивояжёр', sub: 'TSP · маршрут', Comp: TSPView,
    about: 'Поиск кратчайшего замкнутого маршрута по всем городам. Решение — порядок обхода, сосед — разворот участка маршрута (2-opt).' },
  { id: 'func', label: 'Минимум функции', sub: '1D · локальные ямы', Comp: FunctionView,
    about: 'Поиск глобального минимума функции с множеством локальных. Наглядно видно, как на высокой температуре точка перепрыгивает ямы.' },
  { id: 'knap', label: 'Рюкзак', sub: '0/1 Knapsack', Comp: KnapsackView,
    about: 'Набрать предметы максимальной суммарной ценности, не превысив лимит веса. Дискретная комбинаторная задача.' },
];

export default function App() {
  const [active, setActive] = useState('tsp');
  const tab = TABS.find((t) => t.id === active);
  const Comp = tab.Comp;

  return (
    <div className="app">
      <header className="header">
        <div className="title-block">
          <div className="kicker">Метаэвристическая оптимизация</div>
          <h1>Имитация отжига<span className="amp"> · Simulated Annealing</span></h1>
        </div>
        <p className="intro">
          Алгоритм, вдохновлённый отжигом металлов: при высокой «температуре» решение
          свободно блуждает и принимает даже ухудшения с вероятностью
          e<sup>−Δ/T</sup>, а при остывании всё реже — так оно выбирается из локальных
          ловушек и сходится к глобальному оптимуму.
        </p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id}
            className={`tab ${t.id === active ? 'tab-active' : ''}`}
            onClick={() => setActive(t.id)}>
            <span className="tab-label">{t.label}</span>
            <span className="tab-sub">{t.sub}</span>
          </button>
        ))}
      </nav>

      <div className="about">{tab.about}</div>

      <main className="main">
        <Comp key={active} />
      </main>

      <footer className="footer">
        Учебная демонстрация · движок отжига общий для всех задач (см. <code>src/algorithms/annealing.js</code>)
      </footer>
    </div>
  );
}
