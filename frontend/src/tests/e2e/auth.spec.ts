import { test, expect } from "@playwright/test";

const TEST_USER = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@e2e-test.com",
  password: "TestPass123!",
};

const REGISTER_USER = {
  firstName: "Register",
  lastName: "Test",
  email: "register-test@e2e-test.com",
  password: "Register123!",
};

test.describe("Authentication", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("shows validation errors on login form", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill("bad");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test("registers a new user", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel(/first name/i).fill(REGISTER_USER.firstName);
    await page.getByLabel(/last name/i).fill(REGISTER_USER.lastName);
    await page.getByLabel(/^email$/i).fill(REGISTER_USER.email);
    await page.getByLabel(/^password$/i).fill(REGISTER_USER.password);
    await page.getByRole("button", { name: /register/i }).click();
    // Either registration succeeds (redirect to /) or shows error (user exists)
    await Promise.race([
      page.waitForURL("/"),
      page.waitForSelector("text=/already in use/i"),
    ]);
    // If registration succeeded, verify the dashboard is shown
    if (page.url() === "/") {
      await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
    }
  });

  test("logs in with registered user", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill(TEST_USER.email);
    await page.getByLabel(/^password$/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("/");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("logs out successfully", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill(TEST_USER.email);
    await page.getByLabel(/^password$/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("/");

    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page.getByRole("heading", { name: /confirm logout/i })).toBeVisible();
    await page.getByRole("button", { name: /^logout$/i }).click();
    await page.waitForURL("/login");
  });

  test("navigates to register from login", async ({ page }) => {
    await page.goto("/login");
    await page.getByText(/register/i).click();
    await page.waitForURL("/register");
    await expect(page.getByText("Create account")).toBeVisible();
  });

  test("navigates to login from register", async ({ page }) => {
    await page.goto("/register");
    await page.getByText(/sign in/i).click();
    await page.waitForURL("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });
});
