// Общий движок имитации отжига (Simulated Annealing).
//
// Задача описывается интерфейсом Problem:
//   initialState()        -> произвольное начальное решение
//   energy(state)         -> "энергия" (то, что минимизируем)
//   neighbor(state)       -> соседнее решение (малое изменение)
//   clone(state)          -> глубокая копия решения (для снимков)
//
// Движок не зависит от конкретной задачи, поэтому одна и та же
// логика работает и для коммивояжёра, и для функции, и для рюкзака.

export function createAnnealer(problem, params) {
  const {
    tStart = 100,     // начальная температура
    tEnd = 0.01,      // конечная температура
    alpha = 0.995,    // коэффициент охлаждения (T <- T * alpha)
    stepsPerTemp = 1, // число попыток на каждом уровне температуры
  } = params || {};

  let current = problem.initialState();
  let currentE = problem.energy(current);
  let best = problem.clone(current);
  let bestE = currentE;
  let T = tStart;
  let iteration = 0;
  let accepted = 0;
  let lastAccepted = true;

  function step() {
    let didAccept = false;
    for (let i = 0; i < stepsPerTemp; i++) {
      const candidate = problem.neighbor(current);
      const candidateE = problem.energy(candidate);
      const delta = candidateE - currentE;

      // Принимаем улучшение всегда; ухудшение — с вероятностью exp(-Δ/T).
      // Именно это позволяет "выбираться из локальных ям".
      const acceptProb = delta < 0 ? 1 : Math.exp(-delta / T);
      if (Math.random() < acceptProb) {
        current = candidate;
        currentE = candidateE;
        accepted++;
        didAccept = true;
        if (currentE < bestE) {
          bestE = currentE;
          best = problem.clone(current);
        }
      }
      iteration++;
    }
    lastAccepted = didAccept;
    T = Math.max(T * alpha, tEnd);
    return snapshot();
  }

  function snapshot() {
    return {
      current,
      currentE,
      best,
      bestE,
      T,
      iteration,
      accepted,
      lastAccepted,
      finished: T <= tEnd,
    };
  }

  return { step, snapshot, reset: () => createAnnealer(problem, params) };
}
