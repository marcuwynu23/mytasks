import { test, expect, type APIRequestContext } from "@playwright/test";

const TEST_USER = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@e2e-test.com",
  password: "TestPass123!",
};

async function removeTestUser(request: APIRequestContext) {
  const login = await request.post("http://localhost:5000/api/auth/login", {
    data: { email: TEST_USER.email, password: TEST_USER.password },
  });
  if (!login.ok()) return;
  await request.put("http://localhost:5000/api/auth/profile", {
    data: { firstName: TEST_USER.firstName, lastName: TEST_USER.lastName },
  });
}

test.describe("Profile", () => {
  test.afterAll(async ({ request }) => {
    await removeTestUser(request);
  });
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill(TEST_USER.email);
    await page.getByLabel(/^password$/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("/");
    await page.goto("/profile");
    await page.waitForSelector("h1");
  });

  test("shows profile page with user info", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
    await expect(page.getByText(TEST_USER.email).first()).toBeVisible();
  });

  test("shows user initials in avatar", async ({ page }) => {
    await expect(page.getByText("JD")).toBeVisible();
  });

  test("opens edit profile dialog", async ({ page }) => {
    await page.getByRole("button", { name: /edit profile/i }).click();
    await expect(page.getByRole("heading", { name: /edit profile/i })).toBeVisible();
  });

  test("updates first name", async ({ page }) => {
    await page.getByRole("button", { name: /edit profile/i }).click();
    await page.waitForSelector('text="Edit Profile"');

    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.clear();
    await firstNameInput.fill("UpdatedJane");

    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText("UpdatedJane").first()).toBeVisible();
  });

  test("opens change password dialog", async ({ page }) => {
    await page.getByRole("button", { name: /change password/i }).click();
    await expect(page.getByRole("heading", { name: /change password/i })).toBeVisible();
  });

  test("shows password strength badges", async ({ page }) => {
    await page.getByRole("button", { name: /change password/i }).click();
    await page.waitForSelector('text="Change Password"');

    const newPasswordInput = page.getByLabel(/new password/i);
    await newPasswordInput.fill("Weak");
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test("cancels edit profile dialog", async ({ page }) => {
    await page.getByRole("button", { name: /edit profile/i }).click();
    await page.waitForSelector('text="Edit Profile"');
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("heading", { name: /edit profile/i })).toHaveCount(0);
  });
});
