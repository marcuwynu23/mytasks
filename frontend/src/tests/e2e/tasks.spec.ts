import { test, expect } from "@playwright/test";

const TEST_USER = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@e2e-test.com",
  password: "TestPass123!",
};

async function cleanupTasks(request: Parameters<typeof test.BeforeAll>[0]["request"]) {
  const login = await request.post("http://localhost:5000/api/auth/login", {
    data: { email: TEST_USER.email, password: TEST_USER.password },
  });
  if (!login.ok()) return;
  const res = await request.get("http://localhost:5000/api/tasks");
  if (!res.ok()) return;
  const tasks = await res.json();
  for (const t of tasks) {
    await request.delete(`http://localhost:5000/api/tasks/${t._id}`);
  }
}

test.describe("Tasks", () => {
  test.beforeAll(async ({ request }) => {
    await cleanupTasks(request);
  });

  test.afterEach(async ({ request }) => {
    await cleanupTasks(request);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill(TEST_USER.email);
    await page.getByLabel(/^password$/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("/");
    await page.goto("/tasks");
    await page.waitForSelector("h1");
  });

  test("shows empty state when no tasks", async ({ page }) => {
    await expect(page.getByText(/no tasks yet/i)).toBeVisible();
  });

  test("creates a new task", async ({ page }) => {
    await page.getByRole("button", { name: /new task/i }).click();
    await page.waitForSelector('text="New Task"');

    await page.getByRole("textbox", { name: /title/i }).fill("E2E Test Task");
    await page.getByRole("button", { name: /create/i }).click();

    await expect(page.getByText("E2E Test Task")).toBeVisible();
  });

  test("creates a task with due date", async ({ page }) => {
    await page.getByRole("button", { name: /new task/i }).click();
    await page.waitForSelector('text="New Task"');

    await page.getByRole("textbox", { name: /title/i }).fill("Task With Due Date");
    await page.getByLabel(/due date/i).fill("2026-07-20T14:00");
    await page.getByRole("button", { name: /create/i }).click();

    await expect(page.getByText("Task With Due Date")).toBeVisible();
    await expect(page.getByText(/due:/i)).toBeVisible();
  });

  test("edits a task", async ({ page }) => {
    await page.getByRole("button", { name: /new task/i }).click();
    await page.waitForSelector('text="New Task"');
    await page.getByRole("textbox", { name: /title/i }).fill("Original Title");
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page.getByText("Original Title")).toBeVisible();

    await page.getByRole("button", { name: /edit/i }).first().click();
    await page.waitForSelector('text="Edit Task"');
    await page.getByRole("textbox", { name: /title/i }).fill("Updated Title");
    await page.getByRole("button", { name: /update/i }).click();

    await expect(page.getByText("Updated Title")).toBeVisible();
    await expect(page.getByText("Original Title")).toHaveCount(0);
  });

  test("toggles task status", async ({ page }) => {
    await page.getByRole("button", { name: /new task/i }).click();
    await page.waitForSelector('text="New Task"');
    await page.getByRole("textbox", { name: /title/i }).fill("Toggle Me");
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page.getByText("Toggle Me")).toBeVisible();

    const checkbox = page.getByRole("checkbox").first();
    await checkbox.click();
    await expect(page.getByText(/completed/i)).toBeVisible();
  });

  test("deletes a task", async ({ page }) => {
    await page.getByRole("button", { name: /new task/i }).click();
    await page.waitForSelector('text="New Task"');
    await page.getByRole("textbox", { name: /title/i }).fill("Delete Me");
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page.getByText("Delete Me")).toBeVisible();

    await page.getByRole("button", { name: /delete/i }).first().click();
    await expect(page.getByRole("heading", { name: /delete task/i })).toBeVisible();
    await page.getByRole("button", { name: /^delete$/i }).click();
    await expect(page.getByText("Delete Me")).toHaveCount(0);
  });

  test("filters tasks by status", async ({ page }) => {
    await page.getByRole("button", { name: /new task/i }).click();
    await page.waitForSelector('text="New Task"');
    await page.getByRole("textbox", { name: /title/i }).fill("Pending Task");
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page.getByText("Pending Task")).toBeVisible();

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /completed/i }).click();
    await expect(page.getByText("Pending Task")).toHaveCount(0);
    await expect(page.getByText(/no matching tasks/i)).toBeVisible();
  });

  test("searches tasks by title", async ({ page }) => {
    await page.getByRole("button", { name: /new task/i }).click();
    await page.waitForSelector('text="New Task"');
    await page.getByRole("textbox", { name: /title/i }).fill("Unique Search Term");
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page.getByText("Unique Search Term")).toBeVisible();

    await page.getByPlaceholder(/search/i).fill("NonExistent");
    await expect(page.getByText(/no matching tasks/i)).toBeVisible();

    await page.getByPlaceholder(/search/i).fill("Unique");
    await expect(page.getByText("Unique Search Term")).toBeVisible();
  });
});
