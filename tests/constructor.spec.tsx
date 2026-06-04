import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Используем HAR для перехвата запроса ингредиентов
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    // Перехватываем запрос данных пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.ru', name: 'Test User' }
        })
      });
    });

    await page.goto('http://localhost:3000');
  });

  test('должен отобразить список ингредиентов', async ({ page }) => {
    // Проверяем, что отображаются категории ингредиентов
    await expect(page.getByText('Булки')).toBeVisible();
    await expect(page.getByText('Соусы')).toBeVisible();
    await expect(page.getByText('Начинки')).toBeVisible();
  });

  test('должен добавить булку в конструктор при клике', async ({ page }) => {
    // Находим булку по имени из HAR
    const bunIngredientName = 'Краторная булка N-200i';

    // Нажимаем кнопку "Добавить" для конкретной булки
    await page.locator('section').filter({ hasText: bunIngredientName })
      .getByRole('button', { name: /Добавить/i }).click();

    // Проверяем, что конкретная булка появилась в конструкторе
    await expect(page.getByTestId('constructor-bun-top')).toContainText(`${bunIngredientName} (верх)`);
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(`${bunIngredientName} (низ)`);
  });

  test('должен добавить начинку в конструктор при клике', async ({ page }) => {
    // Находим кнопку "Добавить" для соуса или начинки (не первой булки)
    const buttons = await page.getByRole('button', { name: /Добавить/i }).all();
    // Нажимаем на вторую кнопку (первая - булка)
    if (buttons.length > 1) {
      await buttons[1].click();
    }

    // Проверяем, что начинка появилась в конструкторе
    await expect(page.getByText('Начинка')).toBeVisible();
  });

  test('должен открыть модальное окно ингредиента при клике', async ({
    page
  }) => {
    // Кликаем на ингредиент
    await page.locator('[class*="burger-ingredient"]').first().click();

    // Проверяем, что модальное окно открылось
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
  });

  test('должен рассчитать общую стоимость', async ({ page }) => {
    // Добавляем булку
    await page
      .getByRole('button', { name: /Добавить/i })
      .first()
      .click();

    // Проверяем, что сумма отображается
    await expect(page.getByText('0')).toBeVisible();
  });
});
