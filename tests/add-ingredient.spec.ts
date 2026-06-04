import { test, expect } from '@playwright/test';

test.describe('Добавление ингредиента в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');
  });

  test('должен добавить начинку в конструктор при клике на кнопку "Добавить"', async ({ page }) => {
    // Находим начинку (main) по имени из HAR
    const mainIngredientName = 'Мясо бессмертных моллюсков Protostomia';

    // Кликаем на кнопку "Добавить" рядом с конкретным ингредиентом в списке ингредиентов
    await page.locator('section').filter({ hasText: mainIngredientName })
      .getByRole('button', { name: /Добавить/i }).click();

    // Проверяем, что ингредиент появился в конструкторе (в списке начинок)
    await expect(page.getByTestId('constructor-ingredients')).toContainText(mainIngredientName);
  });

  test('должен добавить булку в конструктор', async ({ page }) => {
    // Находим булку по имени из HAR
    const bunIngredientName = 'Краторная булка N-200i';

    // Кликаем на кнопку добавления булки в списке ингредиентов
    await page.locator('section').filter({ hasText: bunIngredientName })
      .getByRole('button', { name: /Добавить/i }).click();

    // Проверяем, что булка отображается в конструкторе (верхняя часть)
    await expect(page.getByTestId('constructor-bun-top')).toContainText(`${bunIngredientName} (верх)`);
  });
});