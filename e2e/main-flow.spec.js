const { test, expect } = require('@playwright/test');
const FitnessPage = require('./pages/FitnessPage');

const positiveCases = [
  {
    title: 'Позитивный сценарий: пользователь 1, вес 70, базовый коэффициент',
    userId: '1',
    weight: '70',
    pulseOverride: '',
    expectedCalories: '320',
    expectedNote: 'Использован базовый коэффициент 0.04.'
  },
  {
    title: 'Позитивный сценарий: пользователь 2, вес 70, удвоение коэффициента',
    userId: '2',
    weight: '70',
    pulseOverride: '',
    expectedCalories: '800',
    expectedNote: 'Коэффициент был удвоен, так как пульс превышает 160 ударов в минуту (Изменение).'
  },
  {
    title: 'DDT: пользователь 1, ручной пульс 170, вес 50',
    userId: '1',
    weight: '50',
    pulseOverride: '170',
    expectedCalories: '457.14',
    expectedNote: 'Коэффициент был удвоен, так как пульс превышает 160 ударов в минуту (Изменение).'
  }
];

const negativeCases = [
  {
    title: 'Негативный сценарий: нечисловой ID пользователя',
    userId: 'abc',
    weight: '70',
    pulse: '',
    expectedError: 'ID пользователя должен быть положительным целым числом'
  },
  {
    title: 'Негативный сценарий: отрицательный вес',
    userId: '1',
    weight: '-5',
    pulse: '',
    expectedError: 'Вес должен быть больше 0'
  },
  {
    title: 'Негативный сценарий: нулевой пульс',
    userId: '1',
    weight: '70',
    pulse: '0',
    expectedError: 'Пульс должен быть больше 0'
  },
  {
    title: 'Негативный сценарий: вес меньше минимального',
    userId: '2',
    weight: '4',
    pulse: '',
    expectedError: 'Минимальный вес — 5 кг'
  },
  {
    title: 'Негативный сценарий: пользователь не найден',
    userId: '999',
    weight: '70',
    pulse: '',
    expectedError: 'Пользователь не найден'
  }
];

test.describe('UI-тесты варианта 15: Фитнес-калории', () => {
  let fitnessPage;

  test.beforeEach(async ({ page }) => {
    fitnessPage = new FitnessPage(page);
    await fitnessPage.navigate();
  });

  test('Последовательные действия: загрузка активности пользователя и расчет калорий', async () => {
    await fitnessPage.setUserId('1');
    await fitnessPage.loadActivity();

    await expect(fitnessPage.page.locator(fitnessPage.activityInfo)).toBeVisible();
    await expect(fitnessPage.page.locator(fitnessPage.stepsInput)).toHaveValue('8000');
    await expect(fitnessPage.page.locator(fitnessPage.pulseInput)).toHaveValue('90');

    await fitnessPage.setWeight('70');
    await fitnessPage.calculate();

    const success = await fitnessPage.getSuccessText();
    await expect(success).toContain('Сожжено калорий: 320');
  });

  for (const item of positiveCases) {
    test(item.title, async () => {
      await fitnessPage.setUserId(item.userId);
      await fitnessPage.setWeight(item.weight);
      await fitnessPage.loadActivity();

      if (item.pulseOverride) {
        await fitnessPage.setPulse(item.pulseOverride);
      }

      await fitnessPage.calculate();
      const successText = await fitnessPage.getSuccessText();
      await expect(successText).toContain(`Сожжено калорий: ${item.expectedCalories}`);
      await expect(successText).toContain(item.expectedNote);
    });
  }

  for (const item of negativeCases) {
    test(item.title, async () => {
      await fitnessPage.setUserId(item.userId);
      await fitnessPage.setWeight(item.weight);

      if (item.pulse) {
        await fitnessPage.setPulse(item.pulse);
      }

      await fitnessPage.calculate();
      const errorText = await fitnessPage.getErrorText();
      await expect(errorText).toContain(item.expectedError);
    });
  }
});
