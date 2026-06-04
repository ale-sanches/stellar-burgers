import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@test.ru',
            name: 'Test User'
          }
        })
      });
    });

    await page.goto('http://localhost:3000');
  });

  test('должен отобразить список ингредиентов', async ({ page }) => {
    await expect(page.getByText('Булки')).toBeVisible();
    await expect(page.getByText('Соусы')).toBeVisible();
    await expect(page.getByText('Начинки')).toBeVisible();
  });

  test('должен добавить булку в конструктор при клике', async ({
                                                                 page
                                                               }) => {
    const bunIngredientName = 'Краторная булка N-200i';

    await page
      .locator('section')
      .filter({ hasText: bunIngredientName })
      .getByRole('button', { name: /Добавить/i })
      .click();

    const topBun = page.getByTestId('constructor-bun-top');
    const bottomBun = page.getByTestId('constructor-bun-bottom');

    await expect(topBun).toContainText(bunIngredientName);
    await expect(bottomBun).toContainText(bunIngredientName);

    await expect(topBun).toContainText('(верх)');
    await expect(bottomBun).toContainText('(низ)');
  });

  test('должен добавить начинку в конструктор при клике', async ({
                                                                   page
                                                                 }) => {
    const ingredientName = 'Биокотлета из марсианской Магнолии';

    await page
      .locator('section')
      .filter({ hasText: ingredientName })
      .getByRole('button', { name: /Добавить/i })
      .click();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText(ingredientName);
  });

  test('должен открыть модальное окно ингредиента при клике', async ({
                                                                       page
                                                                     }) => {
    await page.locator('[class*="burger-ingredient"]').first().click();

    await expect(
      page.getByText('Детали ингредиента')
    ).toBeVisible();
  });

  test('должен рассчитать общую стоимость', async ({ page }) => {
    const bunIngredientName = 'Краторная булка N-200i';

    // Цена этой булки в моковых данных HAR
    const bunPrice = 1255;
    const expectedTotalPrice = bunPrice * 2;

    await page
      .locator('section')
      .filter({ hasText: bunIngredientName })
      .getByRole('button', { name: /Добавить/i })
      .click();

    await expect(
      page.getByTestId('total-price')
    ).toHaveText(String(expectedTotalPrice));
  });
});
