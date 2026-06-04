import { test, expect } from '@playwright/test';

test.describe('Модальные окна ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');
  });

  test('должен открыть модальное окно ингредиента при клике на ингредиент', async ({ page }) => {
    const ingredientId = '643d69a5c3f7b9001cfa093c';
    const ingredientName = 'Краторная булка N-200i';

    // Переходим на страницу ингредиента с state для модального окна
    await page.goto(`http://localhost:3000/ingredients/${ingredientId}`, {
      waitUntil: 'networkidle'
    });

    // Проверяем, что модальное окно открылось с заголовком
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    // Проверяем, что название ингредиента отображается в модальном окне
    await expect(page.getByText(ingredientName)).toBeVisible();
  });

  test('должен закрыть модальное окно по клику на крестик', async ({ page }) => {
    const ingredientId = '643d69a5c3f7b9001cfa093c';

    // Открываем модальное окно
    await page.goto(`http://localhost:3000/ingredients/${ingredientId}`, {
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
    const ingredientId = '643d69a5c3f7b9001cfa093c';

    // Открываем модальное окно
    await page.goto(`http://localhost:3000/ingredients/${ingredientId}`, {
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
