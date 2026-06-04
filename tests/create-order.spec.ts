import { test, expect } from '@playwright/test';

const MOCK_ACCESS_TOKEN = 'mock_access_token';
const MOCK_REFRESH_TOKEN = 'mock_refresh_token';

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.routeFromHAR('tests/hars/auth-user.har', {
      url: 'https://norma.nomoreparties.space/api/auth/user'
    });

    await page.routeFromHAR('tests/hars/orders.har', {
      url: 'https://norma.nomoreparties.space/api/orders'
    });

    await page.addInitScript(
      ({ accessToken, refreshToken }) => {
        document.cookie = `accessToken=${accessToken}; path=/`;
        localStorage.setItem('refreshToken', refreshToken);
      },
      {
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN
      }
    );

    await page.goto('http://localhost:3000');
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('должен создать заказ с ингредиентами', async ({ page }) => {
    // Добавляем булку
    await page
      .getByRole('button', { name: /Добавить/i })
      .first()
      .click();

    // Проверяем, что булка появилась в конструкторе
    await expect(page.getByTestId('constructor-bun-top')).toBeVisible();

    // Оформляем заказ
    await page.getByRole('button', { name: /Оформить заказ/i }).click();

    // Находим модальное окно заказа
    const orderModal = page.getByRole('dialog');

    // Проверяем открытие модалки
    await expect(orderModal).toBeVisible({
      timeout: 10000
    });

    // Проверяем номер заказа внутри модалки
    await expect(orderModal).toContainText('12345');

    // Закрываем модалку
    await page.keyboard.press('Escape');

    // Проверяем закрытие модалки
    await expect(orderModal).not.toBeVisible();

    // Проверяем очистку конструктора после оформления заказа
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Выберите булки'
    );
  });
});