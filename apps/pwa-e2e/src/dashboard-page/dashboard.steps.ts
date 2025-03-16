import { expect, Page } from '@playwright/test';

export const given = {
  userIsOnDashboardPage: givenUserIsOnDashboardPage,
};

export const when = {
  userClicksCreateDocument: whenUserClicksCreateDocument,
  userCreatesDocuments: whenUserCreatesDocuments,
};

export const then = {
  userShouldSeeComposePage: thenUserShouldSeeComposePage,
  userShouldSeeDocumentsList: thenUserShouldSeeDocumentsList,
};

export async function givenUserIsOnDashboardPage(page: Page) {
  await page.goto('/dashboard');
}

export async function whenUserClicksCreateDocument(page: Page) {
  const createButton = page.locator('button:has-text("Create")');
  await expect(createButton).toBeVisible();
  await createButton.click();
  await page.waitForURL('**/compose/**');
}

export async function whenUserCreatesDocuments(
  page: Page,
  documentTitles: string[]
) {
  const createButton = page.locator('button:has-text("Create")');
  for (const title of documentTitles) {
    await expect(createButton).toBeVisible();
    await createButton.click();
    await page.waitForURL('**/compose/**');
    await page.locator('textarea').fill(title);
    await page.waitForTimeout(500); // Simulate delay for saving
    await page.getByText('Dashboard').click();
  }
}

export async function thenUserShouldSeeComposePage(page: Page) {
  await expect(page.locator('textarea')).toBeVisible();
}

export async function thenUserShouldSeeDocumentsList(
  page: Page,
  documentTitles: string[]
) {
  for (const title of documentTitles) {
    await expect(page.getByText(title)).toBeVisible();
  }
}
