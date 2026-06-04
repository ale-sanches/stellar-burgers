import { test, expect } from '@playwright/test';
import ingredients from './fixtures/ingredients.json';

// ID ингредиентов из HAR файла
const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_ID = '643d69a5c3f7b9001cfa0940';

test.describe('Добавление ингредиента в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');
  });

  test('должен добавить начинку в конструктор при клике на кнопку "Добавить"', async ({ page }) => {
    // Находим первую начинку (main) и кликаем на её кнопку добавления
    // Используем первый попавшийся ингредиент с типом main
    const mainIngredient = ingredients.find((i) => i.type === 'main');
    expect(mainIngredient).toBeDefined();

    // Кликаем на кнопку "Добавить" рядом с ингредиентом
    await page.getByRole('button', { name: /Добавить/i }).first().click();

    // Проверяем, что ингредиент появился в конструкторе (в списке начинок)
    await expect(page.locator('section').filter({ hasText: mainIngredient!.name })).toBeVisible();
  });

  test('должен добавить булку в конструктор', async ({ page }) => {
    // Находим булку
    const bunIngredient = ingredients.find((i) => i.type === 'bun');
    expect(bunIngredient).toBeDefined();

    // Кликаем на кнопку добавления булки
    await page.getByRole('button', { name: /Добавить/i }).first().click();

    // Проверяем, что булка отображается в конструкторе (верхняя часть)
    // После добавления булки она должна появиться в конструкторе с текстом "(верх)"
    await expect(
      page.locator('section').filter({ hasText: `${bunIngredient!.name} (верх)` })
    ).toBeVisible();
  });
});
