import { test, expect } from '@playwright/test';
import ingredients from './fixtures/ingredients.json';
import user from './fixtures/user.json';
import order from './fixtures/order.json';

const MOCK_ACCESS_TOKEN = 'mock_access_token';
const MOCK_REFRESH_TOKEN = 'mock_refresh_token';

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем запрос ингредиентов
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: ingredients
        })
      });
    });

    // Перехватываем запрос пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user)
      });
    });

    // Перехватываем создание заказа
    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(order)
        });
      }
    });

    // Устанавливаем токены до загрузки приложения
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
    await expect(
      page.getByTestId('constructor-bun-top')
    ).toBeVisible();

    // Оформляем заказ
    await page
      .getByRole('button', { name: /Оформить заказ/i })
      .click();

    // Находим модальное окно заказа
    const orderModal = page.getByRole('dialog');

    // Проверяем открытие модалки
    await expect(orderModal).toBeVisible({
      timeout: 10000
    });

    // Проверяем номер заказа внутри модалки
    await expect(orderModal).toContainText(
      order.order.number.toString()
    );

    // Закрываем модалку
    await page.keyboard.press('Escape');

    // Проверяем закрытие модалки
    await expect(orderModal).not.toBeVisible();

    // Проверяем очистку конструктора после оформления заказа
    await expect(
      page.getByTestId('constructor-bun-top')
    ).toContainText('Выберите булки');
  });
});
