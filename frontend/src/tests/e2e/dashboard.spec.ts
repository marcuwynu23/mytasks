import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "jane@e2e-test.com",
  password: "TestPass123!",
};

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill(TEST_USER.email);
    await page.getByLabel(/^password$/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("/");
  });

  test("shows dashboard heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("shows stats cards", async ({ page }) => {
    await expect(page.getByText(/total tasks/i)).toBeVisible();
    await expect(page.getByText(/completed/i)).toBeVisible();
    await expect(page.getByText(/pending/i)).toBeVisible();
  });

  test("shows clock", async ({ page }) => {
    const clock = page.locator(".font-mono.tracking-tight").first();
    await expect(clock).toBeVisible();
  });

  test("shows quote of the day", async ({ page }) => {
    await expect(page.getByText(/quote of the day/i)).toBeVisible();
  });

  test("stats update after creating a task", async ({ page }) => {
    await page.goto("/tasks");
    await page.getByRole("button", { name: /new task/i }).click();
    await page.getByRole("textbox", { name: /title/i }).fill("Dashboard Stats Test");
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page.getByText("Dashboard Stats Test")).toBeVisible();

    await page.goto("/");
    await expect(page.getByText(/total tasks/i)).toBeVisible();
  });
});
