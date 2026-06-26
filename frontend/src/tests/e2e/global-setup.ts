import { FullConfig } from "@playwright/test";

const TEST_USER = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@e2e-test.com",
  password: "TestPass123!",
};

async function globalSetup(_config: FullConfig) {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(TEST_USER),
  });
  if (res.status === 201 || res.status === 409) {
    return;
  }
  const text = await res.text();
  console.warn(`Global setup: register returned ${res.status}: ${text}`);
}

export default globalSetup;
