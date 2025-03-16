import { test } from '@playwright/test';
import { given, then } from './hai.steps';

test('has title', async ({ page }) => {
  await given.userIsOnHomePage(page);
  await then.titleIsVisible(page, 'Human Accepted Interaction');
});
