import { expect, test } from '@playwright/test';

test.describe('Flappy Petya smoke', () => {
  test('loads game and shows canvas after loader', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#app-loader')).toBeHidden({ timeout: 15_000 });
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('#game-announcer')).toHaveAttribute('aria-live', 'polite');
  });

  test('starts round via name prompt without firebase', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#app-loader')).toBeHidden({ timeout: 15_000 });
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) {
      return;
    }

    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.44);

    const nameOverlay = page.locator('.name-overlay');
    await expect(nameOverlay).toBeVisible({ timeout: 5_000 });

    await page.locator('.name-dialog__input').fill('E2EPlayer');
    await page.locator('.name-dialog__button').click();

    await expect(nameOverlay).toBeHidden({ timeout: 5_000 });
    await expect(canvas).toBeVisible();
  });

  test('starts round from splash via Enter key', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#app-loader')).toBeHidden({ timeout: 15_000 });
    await page.locator('canvas').focus();
    await page.keyboard.press('Enter');

    await expect(page.locator('.name-overlay')).toBeVisible({ timeout: 5_000 });
  });
});
