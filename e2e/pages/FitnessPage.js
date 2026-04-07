class FitnessPage {
  constructor(page) {
    this.page = page;
    this.userIdInput = '#userId';
    this.weightInput = '#weight';
    this.pulseInput = '#pulse';
    this.stepsInput = '#steps';
    this.loadActivityButton = '#loadActivityBtn';
    this.calculateButton = '#calculateBtn';
    this.activityInfo = '#activityInfo';
    this.successBox = '.success';
    this.errorBox = '.error';
  }

  async navigate() {
    await this.page.goto('/');
  }

  async setUserId(userId) {
    await this.page.fill(this.userIdInput, String(userId));
  }

  async setWeight(weight) {
    await this.page.fill(this.weightInput, String(weight));
  }

  async setPulse(pulse) {
    await this.page.fill(this.pulseInput, String(pulse));
  }

  async loadActivity() {
    await this.page.click(this.loadActivityButton);
  }

  async calculate() {
    await this.page.click(this.calculateButton);
  }

  async getSuccessText() {
    await this.page.locator(this.successBox).waitFor({ state: 'visible' });
    return this.page.locator(this.successBox).textContent();
  }

  async getErrorText() {
    await this.page.locator(this.errorBox).waitFor({ state: 'visible' });
    return this.page.locator(this.errorBox).textContent();
  }
}

module.exports = FitnessPage;
