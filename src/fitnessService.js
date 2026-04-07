const activityDb = {
  '1': { steps: 8000, pulse: 90 },
  '2': { steps: 10000, pulse: 170 },
  '3': { steps: 6000, pulse: 162 }
};

function getActivityByUserId(userId) {
  return activityDb[String(userId)] || null;
}

function calculateCalories(steps, pulse, weight) {
  const s = Number(steps);
  const p = Number(pulse);
  const w = Number(weight);

  if (!Number.isFinite(w)) throw new Error('Вес должен быть числом');
  if (w <= 0) throw new Error('Вес должен быть больше 0');
  if (w < 5) throw new Error('Минимальный вес — 5 кг');
  if (!Number.isFinite(s)) throw new Error('Количество шагов должно быть числом');
  if (s < 0) throw new Error('Некорректное количество шагов');
  if (!Number.isFinite(p)) throw new Error('Пульс должен быть числом');
  if (p <= 0) throw new Error('Пульс должен быть больше 0');

  let coefficient = 0.04;
  if (p > 160) coefficient *= 2;

  const calories = +(s * coefficient * (w / 70)).toFixed(2);
  return { status: 'success', calories, coefficient, doubled: p > 160 };
}

module.exports = { calculateCalories, getActivityByUserId };
