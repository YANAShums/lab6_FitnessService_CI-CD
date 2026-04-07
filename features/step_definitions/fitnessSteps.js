const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const assert = require('assert');
const app = require('../../server');

let activityResponse = null;
let caloriesResponse = null;
let payload = {};

Given('сервис фитнес-калорий доступен по адресу {string}', async function (path) {
  const res = await request(app).get(path);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'online');
});

Given('пользователь с идентификатором {string} существует', function (userId) {
  payload.userId = userId;
});

When('я получаю данные активности по пути {string}', async function (path) {
  activityResponse = await request(app).get(path);
  assert.strictEqual(activityResponse.status, 200);
  payload.steps = activityResponse.body.steps;
  payload.pulse = activityResponse.body.pulse;
});

When('я отправляю POST запрос на {string} с весом {float}', async function (path, weight) {
  payload.weight = weight;
  caloriesResponse = await request(app).post(path).send({
    steps: payload.steps,
    pulse: payload.pulse,
    weight: payload.weight
  });
});

Then('API возвращает статус-код {int}', function (expectedCode) {
  assert.strictEqual(caloriesResponse.status, expectedCode);
});

Then('ответ содержит статус {string}', function (expectedStatus) {
  assert.strictEqual(caloriesResponse.body.status, expectedStatus);
});

Then('результат соответствует ожидаемому значению {string}', function (expectedValue) {
  if (caloriesResponse.status === 200) {
    const steps = Number(payload.steps);
    const pulse = Number(payload.pulse);
    const weight = Number(payload.weight);
    let coefficient = 0.04;
    if (pulse > 160) coefficient *= 2;
    const expectedCalories = +(steps * coefficient * (weight / 70)).toFixed(2);
    assert.strictEqual(caloriesResponse.body.calories, expectedCalories);
  } else {
    assert.ok(String(caloriesResponse.body.message).includes(expectedValue));
  }
});
