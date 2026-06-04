import { test, expect } from '@playwright/test';

test.describe('Модальные окна ингредиентов', () => {
  const ingredientName = 'Краторная булка N-200i';

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');
  });

  test('должен открыть модальное окно ингредиента при клике на ингредиент', async ({
    page
  }) => {
    // Кликаем по ингредиенту в интерфейсе
    await page.getByText(ingredientName).first().click();

    // Проверяем открытие модального окна
    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента'
    });

    await expect(modalTitle).toBeVisible();

    // Проверяем, что отображается выбранный ингредиент
    await expect(page.getByText(ingredientName)).toBeVisible();

    // Проверяем изменение URL
    await expect(page).toHaveURL(/\/ingredients\/643d69a5c3f7b9001cfa093c$/);
  });

  test('должен закрыть модальное окно по клику на крестик', async ({
    page
  }) => {
    // Открываем модалку через пользовательский сценарий
    await page.getByText(ingredientName).first().click();

    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента'
    });

    await expect(modalTitle).toBeVisible();

    // Находим кнопку закрытия
    const closeButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();

    await closeButton.click();

    // Проверяем закрытие модалки
    await expect(modalTitle).not.toBeVisible();

    // Проверяем возврат на главную страницу
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('должен закрыть модальное окно по клику на оверлей', async ({
    page
  }) => {
    // Открываем модалку через пользовательский сценарий
    await page.getByText(ingredientName).first().click();

    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента'
    });

    await expect(modalTitle).toBeVisible();

    // Кликаем по оверлею
    await page.mouse.click(1, 1);

    // Проверяем закрытие модалки
    await expect(modalTitle).not.toBeVisible();

    // Проверяем возврат на главную страницу
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
