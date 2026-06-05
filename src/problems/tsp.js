// Задача коммивояжёра (TSP).
// Решение — порядок обхода городов (массив индексов).
// Сосед — разворот случайного участка маршрута (2-opt move).

export function makeTSP(cities) {
  const n = cities.length;

  function dist(a, b) {
    const dx = cities[a].x - cities[b].x;
    const dy = cities[a].y - cities[b].y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return {
    cities,
    initialState() {
      const order = Array.from({ length: n }, (_, i) => i);
      // случайная стартовая перестановка
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return order;
    },
    energy(order) {
      let total = 0;
      for (let i = 0; i < n; i++) {
        total += dist(order[i], order[(i + 1) % n]);
      }
      return total;
    },
    neighbor(order) {
      const next = order.slice();
      let i = Math.floor(Math.random() * n);
      let j = Math.floor(Math.random() * n);
      if (i > j) [i, j] = [j, i];
      // 2-opt: разворачиваем сегмент [i, j]
      while (i < j) {
        [next[i], next[j]] = [next[j], next[i]];
        i++;
        j--;
      }
      return next;
    },
    clone(order) {
      return order.slice();
    },
  };
}
