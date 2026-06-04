import { test, expect } from '@playwright/test';

test.describe('Перехват запроса ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');
  });

  test('должен вернуть моковые данные ингредиентов', async ({ page }) => {
    // Ожидаем загрузки ингредиентов
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });
});
