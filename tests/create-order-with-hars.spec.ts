import { test, expect } from '@playwright/test';
import order from './fixtures/order.json';

const MOCK_ACCESS_TOKEN = 'mock_access_token';
const MOCK_REFRESH_TOKEN = 'mock_refresh_token';

test.describe('Создание заказа с HAR', () => {
  test.beforeEach(async ({ page }) => {
    // Используем HAR для перехвата запроса ингредиентов (без update - только чтение)
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    // Перехватываем запрос данных пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.ru', name: 'Test User' }
        })
      });
    });

    // Перехватываем запрос создания заказа
    await page.route('**/api/orders', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(order)
        });
      }
    });

    // Устанавливаем моковые токены в cookie и localStorage перед тестом
    await page.addInitScript((tokens) => {
      document.cookie = `accessToken=${tokens.accessToken}; path=/`;
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }, { accessToken: MOCK_ACCESS_TOKEN, refreshToken: MOCK_REFRESH_TOKEN });

    await page.goto('http://localhost:3000');
  });

  test.afterEach(async ({ page }) => {
    // Очищаем токены после завершения теста
    await page.addInitScript(() => {
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('refreshToken');
    });
  });

  test('должен создать заказ с ингредиентами', async ({ page }) => {
    // Добавляем булку
    await page.getByRole('button', { name: /Добавить/i }).first().click();

    // Ожидаем появления булки в конструкторе
    await expect(page.locator('section').filter({ hasText: /(верх|низ)/i })).toBeVisible();

    // Нажимаем кнопку "Оформить заказ"
    await page.getByRole('button', { name: /Оформить заказ/i }).click();

    // Проверяем, что модальное окно открылось и номер заказа верный
    await expect(page.getByText(order.order.number.toString())).toBeVisible({ timeout: 10000 });

    // Закрываем модальное окно нажатием Escape
    await page.keyboard.press('Escape');

    // Проверяем, что модальное окно закрылось
    await expect(page.getByText(order.order.number.toString())).not.toBeVisible();

    // Проверяем, что конструктор пуст (нет булки)
    await expect(page.locator('section').filter({ hasText: /Выберите булки/ })).toBeVisible();
  });
});