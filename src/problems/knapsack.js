// Задача о рюкзаке (0/1 Knapsack).
// Решение — булев массив: брать предмет или нет.
// Энергия — отрицательная ценность + штраф за превышение веса
// (минимизируем энергию => максимизируем ценность при ограничении).
// Сосед — инвертируем "взять/не брать" у случайного предмета.

export function makeKnapsack(items, capacity) {
  const n = items.length;
  const PENALTY = 1000; // штраф за каждую единицу перевеса

  function evaluate(taken) {
    let weight = 0;
    let value = 0;
    for (let i = 0; i < n; i++) {
      if (taken[i]) {
        weight += items[i].weight;
        value += items[i].value;
      }
    }
    return { weight, value };
  }

  return {
    items,
    capacity,
    evaluate,
    initialState() {
      return Array.from({ length: n }, () => false);
    },
    energy(taken) {
      const { weight, value } = evaluate(taken);
      const over = Math.max(0, weight - capacity);
      return -value + over * PENALTY;
    },
    neighbor(taken) {
      const next = taken.slice();
      const i = Math.floor(Math.random() * n);
      next[i] = !next[i];
      return next;
    },
    clone(taken) {
      return taken.slice();
    },
  };
}
