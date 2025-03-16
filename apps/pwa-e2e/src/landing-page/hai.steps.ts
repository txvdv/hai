import { expect, Page } from '@playwright/test';

export const given = {
  userIsOnHomePage: givenUserIsOnHomePage,
};

export const then = {
  titleIsVisible: thenTitleIsVisible,
};

export async function givenUserIsOnHomePage(page: Page) {
  await page.goto('/');
}

export async function thenTitleIsVisible(page: Page, title: string) {
  await expect(page.getByText(title)).toBeVisible();
}
