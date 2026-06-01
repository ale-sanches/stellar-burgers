import { test, expect } from '@playwright/test';
import ingredients from '../tests/fixtures/ingredients.json';

test.describe('Перехват запроса ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем запрос ингредиентов и возвращаем моковые данные
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: ingredients })
      });
    });

    await page.goto('http://localhost:3000');
  });

  test('должен вернуть моковые данные ингредиентов', async ({ page }) => {
    // Ожидаем загрузки ингредиентов
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });
});
