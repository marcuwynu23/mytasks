import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "jane@e2e-test.com",
  password: "TestPass123!",
};

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill(TEST_USER.email);
    await page.getByLabel(/^password$/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("/");
  });

  test("navigates to tasks page from header", async ({ page }) => {
    await page.getByRole("link", { name: /tasks/i }).first().click();
    await page.waitForURL("/tasks");
    await expect(page.getByRole("heading", { name: /tasks/i })).toBeVisible();
  });

  test("navigates to profile page from header", async ({ page }) => {
    await page.getByRole("link", { name: /profile/i }).first().click();
    await page.waitForURL("/profile");
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
  });

  test("navigates to dashboard from header", async ({ page }) => {
    await page.goto("/tasks");
    await page.getByRole("link", { name: /dashboard/i }).first().click();
    await page.waitForURL("/");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("shows 404 page for unknown route", async ({ page }) => {
    await page.goto("/non-existent-route");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
  });

  test("404 page has back to home link", async ({ page }) => {
    await page.goto("/non-existent-route");
    await page.getByRole("link", { name: /back to home/i }).click();
    await page.waitForURL("/");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("logout confirmation dialog can be cancelled", async ({ page }) => {
    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page.getByRole("heading", { name: /confirm logout/i })).toBeVisible();
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("heading", { name: /confirm logout/i })).toHaveCount(0);
  });
});
