import { test, expect } from '@playwright/test';

const MOCK_ACCESS_TOKEN = 'mock_access_token';
const MOCK_REFRESH_TOKEN = 'mock_refresh_token';

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
    const mainIngredientName = 'Мясо бессмертных моллюсков Protostomia';

    await page
      .getByRole('listitem')
      .filter({ hasText: mainIngredientName })
      .getByRole('button', { name: /Добавить/i })
      .click();

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText(mainIngredientName);
  });

  test('должен добавить булку в конструктор', async ({ page }) => {
    const bunIngredientName = 'Краторная булка N-200i';

    await page
      .getByRole('listitem')
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

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');
  });

  test('должен отобразить список ингредиентов', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Булки' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Соусы' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Начинки' })).toBeVisible();
  });

  test('должен добавить булку в конструктор при клике', async ({
    page
  }) => {
    const bunIngredientName = 'Краторная булка N-200i';

    await page
      .getByRole('listitem')
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
      .getByRole('listitem')
      .filter({ hasText: ingredientName })
      .getByRole('button', { name: /Добавить/i })
      .click();

    const constructor = page.getByTestId('constructor-ingredients');

    await expect(constructor).toContainText(ingredientName);
  });

  test('должен открыть страницу ингредиента при клике', async ({
    page
  }) => {
    const ingredientName = 'Краторная булка N-200i';

    await page.getByRole('listitem').filter({ hasText: ingredientName }).click();

    await expect(page).toHaveURL(/\/ingredients\/643d69a5c3f7b9001cfa093c$/);

    await expect(page.getByRole('heading', { name: ingredientName })).toBeVisible();
  });

  test('должен отобразить кнопку оформления заказа', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Оформить заказ/i })).toBeVisible();
  });
});

test.describe('Модальные окна ингредиентов', () => {
  const ingredientName = 'Краторная булка N-200i';

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.goto('http://localhost:3000');

    await expect(page.getByRole('heading', { name: 'Булки' })).toBeVisible();
  });

  test('должен открыть страницу ингредиента при клике на ингредиент', async ({
    page
  }) => {
    await page.getByRole('listitem').filter({ hasText: ingredientName }).click();

    await expect(page).toHaveURL(/\/ingredients\/643d69a5c3f7b9001cfa093c$/);

    await expect(page.getByRole('heading', { name: ingredientName })).toBeVisible();

    await expect(page.getByText('Калории, ккал')).toBeVisible();
  });

  test('должен закрыть страницу ингредиента по клику на крестик', async ({
    page
  }) => {
    await page.getByRole('listitem').filter({ hasText: ingredientName }).click();

    await expect(page).toHaveURL(/\/ingredients\/643d69a5c3f7b9001cfa093c$/);

    await expect(page.getByRole('heading', { name: ingredientName })).toBeVisible();

    await page.goBack();

    await expect(page).toHaveURL('http://localhost:3000/');

    await expect(page.getByRole('heading', { name: ingredientName })).not.toBeVisible();
  });

  test('должен закрыть страницу ингредиента по клику на оверлей', async ({
    page
  }) => {
    await page.getByRole('listitem').filter({ hasText: ingredientName }).click();

    await expect(page).toHaveURL(/\/ingredients\/643d69a5c3f7b9001cfa093c$/);

    await expect(page.getByRole('heading', { name: ingredientName })).toBeVisible();

    await page.goBack();

    await expect(page).toHaveURL('http://localhost:3000/');

    await expect(page.getByRole('heading', { name: ingredientName })).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.nomoreparties.space/api/ingredients'
    });

    await page.routeFromHAR('tests/hars/auth-user.har', {
      url: 'https://norma.nomoreparties.space/api/auth/user'
    });

    await page.routeFromHAR('tests/hars/orders.har', {
      url: 'https://norma.nomoreparties.space/api/orders'
    });

    await page.addInitScript(
      ({ accessToken, refreshToken }) => {
        document.cookie = `accessToken=${accessToken}; path=/`;
        localStorage.setItem('refreshToken', refreshToken);
      },
      {
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN
      }
    );

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('должен создать заказ с ингредиентами', async ({ page }) => {
    await page
      .getByRole('button', { name: /Добавить/i })
      .first()
      .click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible();

    await page.getByRole('button', { name: /Оформить заказ/i }).click();

    await expect(page.getByText('12345')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await expect(page.getByText('12345')).not.toBeVisible();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Выберите булки'
    );
  });
});