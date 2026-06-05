// Поиск глобального минимума "колючей" функции на отрезке.
// Решение — число x в диапазоне [xMin, xMax].
// Сосед — сдвиг x на случайную величину (шаг масштабируется так,
// чтобы при остывании прыжки естественно уменьшались — здесь
// фиксированный, движок сам реже принимает большие ухудшения).

// f(x) = sin(x) + sin(2.3x) + cos(3.7x) — много локальных минимумов.
export function makeFunction1D() {
  const xMin = 0;
  const xMax = 20;

  const f = (x) => Math.sin(x) + Math.sin(2.3 * x) + Math.cos(3.7 * x);

  return {
    f,
    xMin,
    xMax,
    initialState() {
      return xMin + Math.random() * (xMax - xMin);
    },
    energy(x) {
      return f(x);
    },
    neighbor(x) {
      const step = (Math.random() - 0.5) * 2.0; // ±1
      let nx = x + step;
      if (nx < xMin) nx = xMin + (xMin - nx);
      if (nx > xMax) nx = xMax - (nx - xMax);
      return Math.max(xMin, Math.min(xMax, nx));
    },
    clone(x) {
      return x;
    },
  };
}
