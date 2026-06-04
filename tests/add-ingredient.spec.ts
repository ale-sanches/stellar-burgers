import { test, expect } from '@playwright/test';

test.describe('Добавление ингредиента в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');
  });

  test('должен добавить начинку в конструктор при клике на кнопку "Добавить"', async ({
                                                                                        page
                                                                                      }) => {
    const mainIngredientName =
      'Мясо бессмертных моллюсков Protostomia';

    await page
      .locator('section')
      .filter({ hasText: mainIngredientName })
      .getByRole('button', { name: /Добавить/i })
      .click();

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText(mainIngredientName);
  });

  test('должен добавить булку в конструктор', async ({
                                                       page
                                                     }) => {
    const bunIngredientName = 'Краторная булка N-200i';

    await page
      .locator('section')
      .filter({ hasText: bunIngredientName })
      .getByRole('button', { name: /Добавить/i })
      .click();

    await expect(
      page.getByTestId('constructor-bun-top')
    ).toContainText(`${bunIngredientName} (верх)`);

    await expect(
      page.getByTestId('constructor-bun-bottom')
    ).toContainText(`${bunIngredientName} (низ)`);
  });
});
