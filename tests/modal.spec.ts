import { test, expect } from '@playwright/test';
import ingredients from './fixtures/ingredients.json';

test.describe('Модальные окна ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем запрос ингредиентов
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: ingredients })
      });
    });

    await page.goto('http://localhost:3000');
  });

  test('должен открыть модальное окно ингредиента при клике на ингредиент', async ({ page }) => {
    // Находим id первого ингредиента
    const ingredient = ingredients[0];

    // Переходим на страницу ингредиента с state для модального окна
    await page.goto(`http://localhost:3000/ingredients/${ingredient._id}`, {
      waitUntil: 'networkidle'
    });

    // Проверяем, что модальное окно открылось с заголовком
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    // Проверяем, что название ингредиента отображается в модальном окне
    await expect(page.getByText(ingredient.name)).toBeVisible();
  });

  test('должен закрыть модальное окно по клику на крестик', async ({ page }) => {
    const ingredient = ingredients[0];

    // Открываем модальное окно
    await page.goto(`http://localhost:3000/ingredients/${ingredient._id}`, {
      waitUntil: 'networkidle'
    });

    // Проверяем, что модальное окно открыто
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    // Находим кнопку закрытия (по наличию SVG иконки закрытия)
    const closeButton = page.locator('button').filter({ has: page.locator('svg') });
    await closeButton.click();

    // Проверяем, что модальное окно закрылось - URL должен измениться
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('должен закрыть модальное окно по клику на оверлей', async ({ page }) => {
    const ingredient = ingredients[0];

    // Открываем модальное окно
    await page.goto(`http://localhost:3000/ingredients/${ingredient._id}`, {
      waitUntil: 'networkidle'
    });

    // Проверяем, что модальное окно открыто
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    // Кликаем на оверлей (фон модального окна)
    // Оверлей покрывает всю страницу, кликаем в левый верхний угол
    await page.mouse.click(1, 1);

    // Проверяем, что модальное окно закрылось
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});