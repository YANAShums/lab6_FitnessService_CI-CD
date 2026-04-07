const { calculateCalories, getActivityByUserId } = require('../src/fitnessService');

describe('fitnessService', () => {
  test('возвращает активность пользователя по id', () => {
    expect(getActivityByUserId('1')).toEqual({ steps: 8000, pulse: 90 });
  });

  test('возвращает null для неизвестного пользователя', () => {
    expect(getActivityByUserId('999')).toBeNull();
  });

  test('расчёт калорий с базовым коэффициентом', () => {
    expect(calculateCalories(8000, 90, 70)).toEqual({
      status: 'success',
      calories: 320,
      coefficient: 0.04,
      doubled: false
    });
  });

  test('удваивает коэффициент при пульсе больше 160', () => {
    expect(calculateCalories(10000, 170, 70)).toEqual({
      status: 'success',
      calories: 800,
      coefficient: 0.08,
      doubled: true
    });
  });

  test('ошибка при весе меньше 5 кг', () => {
    expect(() => calculateCalories(10000, 170, 4)).toThrow('Минимальный вес — 5 кг');
  });
});
