import { useRef, useState, useCallback, useEffect } from 'react';
import { createAnnealer } from '../algorithms/annealing.js';

// Управляет жизненным циклом отжига: старт/пауза/сброс/скорость.
// history — массив { e, bestE, T } для графиков.
export function useAnnealing(buildProblem, params, deps) {
  const [snap, setSnap] = useState(null);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [speed, setSpeed] = useState(20); // шагов алгоритма за тик анимации

  const annealerRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    runningRef.current = false;
    setRunning(false);
    const problem = buildProblem();
    annealerRef.current = createAnnealer(problem, params);
    const s = annealerRef.current.snapshot();
    setSnap(s);
    setHistory([{ e: s.currentE, bestE: s.bestE, T: s.T }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { reset(); }, [reset]);

  const loop = useCallback(() => {
    if (!runningRef.current || !annealerRef.current) return;
    let s;
    const batch = speedRef.current;
    for (let i = 0; i < batch; i++) {
      s = annealerRef.current.step();
      if (s.finished) break;
    }
    setSnap(s);
    setHistory((h) => {
      const next = h.concat({ e: s.currentE, bestE: s.bestE, T: s.T });
      return next.length > 600 ? next.slice(next.length - 600) : next;
    });
    if (s.finished) {
      runningRef.current = false;
      setRunning(false);
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(() => {
    if (runningRef.current) return;
    if (annealerRef.current?.snapshot().finished) reset();
    runningRef.current = true;
    setRunning(true);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, reset]);

  const pause = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { snap, running, history, speed, setSpeed, start, pause, reset };
}
