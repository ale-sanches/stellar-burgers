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
        body: JSON.stringify({ success: true, data: ingredients })
      });
    });

    // Перехватываем запрос данных пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user)
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

    // Устанавливаем моковые токены в cookie и localStorage
    await page.addInitScript((tokens) => {
      // Устанавливаем accessToken в cookie
      document.cookie = `accessToken=${tokens.accessToken}; path=/`;
      // Устанавливаем refreshToken в localStorage
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }, { accessToken: MOCK_ACCESS_TOKEN, refreshToken: MOCK_REFRESH_TOKEN });

    await page.goto('http://localhost:3000');
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