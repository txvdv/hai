import { test, expect } from '@playwright/test';
import { given, when, then } from './dashboard.steps';

test('should show a create document button', async ({ page }) => {
  await given.userIsOnDashboardPage(page);
  await expect(page.locator('button:has-text("Create")')).toBeVisible();
});

test('starting a new document', async ({ page }) => {
  await given.userIsOnDashboardPage(page);
  await when.userClicksCreateDocument(page);
  await then.userShouldSeeComposePage(page);
});

test('listing the documents', async ({ page }) => {
  const documentTitles = ['Document 1', 'Document 2', 'Document 3'];

  await given.userIsOnDashboardPage(page);
  await when.userCreatesDocuments(page, documentTitles);
  await then.userShouldSeeDocumentsList(page, documentTitles);
});
