import { test, expect } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:8001';

test.describe('addon-backgrounds', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storybookUrl);
    await new SbPage(page).waitUntilLoaded();
  });

  const backgroundToolbarSelector = '[title="Change the background of the preview"]';
  const gridToolbarSelector = '[title="Apply a grid to the preview"]';

  test('should have a dark background', async ({ page }) => {
    const sbPage = new SbPage(page);

    await sbPage.navigateToStory('example/button', 'primary');
    await sbPage.selectToolbar(backgroundToolbarSelector, '#list-item-dark');

    await expect(sbPage.getCanvasBodyElement()).toHaveCSS('background-color', 'rgb(51, 51, 51)');
  });

  test('should apply a grid', async ({ page }) => {
    const sbPage = new SbPage(page);

    await sbPage.navigateToStory('example/button', 'primary');
    await sbPage.selectToolbar(gridToolbarSelector);

    await expect(sbPage.getCanvasBodyElement()).toHaveCSS('background-image', /linear-gradient/);
  });

  test('button should appear for story pages', async ({ page }) => {
    const sbPage = new SbPage(page);

    await sbPage.navigateToStory('example/button', 'primary');
    await expect(sbPage.page.locator(backgroundToolbarSelector)).toBeVisible();
  });

  test('button should appear for attached docs pages', async ({ page }) => {
    const sbPage = new SbPage(page);

    await sbPage.navigateToStory('example/button', 'docs');
    await expect(sbPage.page.locator(backgroundToolbarSelector)).toBeVisible();
  });

  test('button should appear for unattached docs pages', async ({ page }) => {
    const sbPage = new SbPage(page);

    // We start on the introduction page by default.
    await sbPage.page.waitForURL((url) =>
      url.search.includes(`path=/docs/example-introduction--docs`)
    );

    await expect(sbPage.page.locator(backgroundToolbarSelector)).toBeVisible();
  });
});
