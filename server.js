const express = require('express');
const path = require('path');
const { calculateCalories, getActivityByUserId } = require('./src/fitnessService');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'online', timestamp: new Date().toISOString() });
});

app.get('/api/fitness/activity/:userId', (req, res) => {
  const activity = getActivityByUserId(req.params.userId);
  if (!activity) {
    return res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
  }
  return res.status(200).json({
    status: 'success',
    userId: String(req.params.userId),
    steps: activity.steps,
    pulse: activity.pulse
  });
});

app.post('/api/fitness/calories', (req, res) => {
  try {
    const { steps, pulse, weight } = req.body || {};
    return res.status(200).json(calculateCalories(steps, pulse, weight));
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}

module.exports = app;
