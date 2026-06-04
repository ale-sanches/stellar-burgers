import { test, expect } from '@playwright/test';

const MOCK_ACCESS_TOKEN = 'mock_access_token';
const MOCK_REFRESH_TOKEN = 'mock_refresh_token';

test.describe('Создание заказа с HAR', () => {
  test.beforeEach(async ({ page }) => {
    // Используем HAR для перехвата запроса ингредиентов
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients',
      notFound: 'abort'
    });

    // Используем HAR для перехвата запроса данных пользователя
    await page.routeFromHAR('tests/hars/auth-user.har', {
      url: 'https://norma.nomoreparties.space/api/auth/user',
      notFound: 'abort'
    });

    // Используем HAR для перехвата запроса создания заказа
    await page.routeFromHAR('tests/hars/orders.har', {
      url: 'https://norma.nomoreparties.space/api/orders',
      notFound: 'abort'
    });

    // Устанавливаем моковые токены в cookie и localStorage перед тестом
    await page.addInitScript((tokens) => {
      document.cookie = `accessToken=${tokens.accessToken}; path=/`;
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }, { accessToken: MOCK_ACCESS_TOKEN, refreshToken: MOCK_REFRESH_TOKEN });

    await page.goto('http://localhost:3000');
  });

  test.afterEach(async ({ page }) => {
    // Очищаем токены после завершения теста
    await page.addInitScript(() => {
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('refreshToken');
    });
  });

  test('должен создать заказ с ингредиентами', async ({ page }) => {
    const orderNumber = 12345;

    // Добавляем булку
    await page.getByRole('button', { name: /Добавить/i }).first().click();

    // Ожидаем появления булки в конструкторе
    await expect(page.getByTestId('constructor-bun-top')).toBeVisible();

    // Нажимаем кнопку "Оформить заказ"
    await page.getByRole('button', { name: /Оформить заказ/i }).click();

    // Проверяем, что модальное окно открылось и номер заказа верный
    await expect(page.getByText(orderNumber.toString())).toBeVisible({ timeout: 10000 });

    // Закрываем модальное окно нажатием Escape
    await page.keyboard.press('Escape');

    // Проверяем, что модальное окно закрылось
    await expect(page.getByText(orderNumber.toString())).not.toBeVisible();

    // Проверяем, что конструктор пуст (нет булки)
    await expect(page.getByTestId('constructor-bun-top')).toContainText('Выберите булки');
  });
});