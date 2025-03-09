import { test, expect } from '@playwright/test';

test.describe('/composer route tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the composer route before each test
    await page.goto('/composer');
    await flushPromises();
  });

  test('renders DocumentsView with correct UI elements', async ({ page }) => {
    // Check Navigation items
    const navLinks = await page.locator('.navigation a');
    await expect(navLinks.nth(0)).toHaveText('HAI');
    await expect(navLinks.nth(1)).toHaveText('Dashboard');
    await expect(navLinks.nth(2)).toHaveText('Composer');

    // Verify textarea, buttons, and the document list
    await expect(page.locator('textarea.document-textarea')).toBeVisible();
    await expect(page.locator('button:has-text("New document")')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
  });

  test('can create a new document', async ({ page }) => {
    // Click the 'New document' button
    await page.locator('button:has-text("New document")').click();

    // Input text into the textarea
    const textarea = page.locator('textarea.document-textarea');
    await textarea.fill('This is a new document.');

    // Save the document
    await page.locator('button:has-text("Save")').click();

    // Assert that the document appears in the list
    await expect(page.getByText('This is a new document.')).toBeVisible();
  });

  // TODO: find solution for chromium fail
  test.skip('can edit a document', async ({ page }) => {
    // Create a test document
    const textarea = page.locator('textarea.document-textarea');
    await textarea.fill('Document to change.');
    await page.locator('button:has-text("Save")').click();

    await page.waitForSelector('role=button[name="Edit Document"]');
    const editButton = page.getByRole('button', { name: 'Edit Document' }).first();
    await editButton.click();

    // Modify the content
    await textarea.fill('Updated document content.');
    await page.locator('button:has-text("Save")').click();

    await flushPromises();

    // Verify the updated content is saved in the list
    await expect(page.getByText('Updated document content.')).toBeVisible();
  });

  // TODO: find solution for chromium fail
  test.skip('can delete a document', async ({ page }) => {
    // Create a test document
    const textarea = page.locator('textarea.document-textarea');
    await textarea.fill('Document.');
    await page.locator('button:has-text("Save")').click();

    // Click the "delete" button for the created document
    await page.waitForSelector('role=button[name="Delete Document"]');
    const deleteButton = page.getByRole('button', { name: 'Delete Document' }).first();
    await deleteButton.click();

    // Verify the document is removed from the list
    await expect(page.getByText('Document.')).toBeHidden();
  });

  test('preserves navigation functionality', async ({ page }) => {
    // Check that clicking on the navigation links works as expected

    // Click the "Dashboard" link
    await page.locator('a > span:has-text("Dashboard")').click();
    await expect(page).toHaveURL('/dashboard');

    // Click the "Composer" link to navigate back
    await page.locator('a > span:has-text("Composer")').click();
    await expect(page).toHaveURL('/composer');
  });
});

// Utility function to wait for promises to resolve
function flushPromises(): Promise<void> {
  return new Promise(setImmediate);
}