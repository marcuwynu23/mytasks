import request from "supertest";
import app from "@/app";
import { setupDB, teardownDB, clearDB } from "./setup";

beforeAll(async () => { await setupDB(); });
afterAll(async () => { await teardownDB(); });
afterEach(async () => { await clearDB(); });

const BASE = "/api/auth";
const credentials = { firstName: "Test", middleName: "M", lastName: "User", email: "test@example.com", password: "Password1!" };

describe("POST /api/auth/register", () => {
  it("registers a new user and sets cookie", async () => {
    const res = await request(app).post(`${BASE}/register`).send(credentials);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("registers without middleName (optional)", async () => {
    const res = await request(app).post(`${BASE}/register`).send({ firstName: "Jane", lastName: "Doe", email: "jane@example.com", password: "Password1!" });
    expect(res.status).toBe(201);
  });

  it("returns 409 for duplicate email", async () => {
    await request(app).post(`${BASE}/register`).send(credentials);
    const res = await request(app).post(`${BASE}/register`).send(credentials);
    expect(res.status).toBe(409);
  });

  it("returns 400 when required fields missing", async () => {
    const res = await request(app).post(`${BASE}/register`).send({ email: "x@x.com", password: "pass" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for weak password (too short)", async () => {
    const res = await request(app).post(`${BASE}/register`).send({ ...credentials, password: "Ab1!" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for password missing uppercase", async () => {
    const res = await request(app).post(`${BASE}/register`).send({ ...credentials, password: "password1!" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for password missing number", async () => {
    const res = await request(app).post(`${BASE}/register`).send({ ...credentials, password: "Password!" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for password missing symbol", async () => {
    const res = await request(app).post(`${BASE}/register`).send({ ...credentials, password: "Password1" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post(`${BASE}/register`).send(credentials);
  });

  it("logs in with valid credentials", async () => {
    const res = await request(app).post(`${BASE}/login`).send({ email: credentials.email, password: credentials.password });
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app).post(`${BASE}/login`).send({ email: credentials.email, password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when fields missing", async () => {
    const res = await request(app).post(`${BASE}/login`).send({ email: credentials.email });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie", async () => {
    const res = await request(app).post(`${BASE}/logout`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });
});

describe("GET /api/auth/profile", () => {
  it("returns profile for authenticated user", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    const res = await agent.get(`${BASE}/profile`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(credentials.email);
    expect(res.body.firstName).toBe(credentials.firstName);
    expect(res.body.lastName).toBe(credentials.lastName);
    expect(res.body.password).toBeUndefined();
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get(`${BASE}/profile`);
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/auth/profile", () => {
  it("updates profile fields", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    const res = await agent.put(`${BASE}/profile`).send({ firstName: "Updated", lastName: "Name" });
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe("Updated");
    expect(res.body.lastName).toBe("Name");
    expect(res.body.password).toBeUndefined();
  });

  it("returns 400 when no fields provided", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    const res = await agent.put(`${BASE}/profile`).send({});
    expect(res.status).toBe(400);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).put(`${BASE}/profile`).send({ firstName: "X" });
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/auth/password", () => {
  it("changes password with correct current password", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    const res = await agent.put(`${BASE}/password`).send({ currentPassword: credentials.password, newPassword: "NewPass1!" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password changed successfully");
  });

  it("can login with new password after change", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    await agent.put(`${BASE}/password`).send({ currentPassword: credentials.password, newPassword: "NewPass1!" });
    const res = await request(app).post(`${BASE}/login`).send({ email: credentials.email, password: "NewPass1!" });
    expect(res.status).toBe(200);
  });

  it("returns 401 for wrong current password", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    const res = await agent.put(`${BASE}/password`).send({ currentPassword: "WrongPass1!", newPassword: "NewPass1!" });
    expect(res.status).toBe(401);
  });

  it("returns 400 for weak new password", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    const res = await agent.put(`${BASE}/password`).send({ currentPassword: credentials.password, newPassword: "weak" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when fields missing", async () => {
    const agent = request.agent(app);
    await agent.post(`${BASE}/register`).send(credentials);
    const res = await agent.put(`${BASE}/password`).send({ currentPassword: credentials.password });
    expect(res.status).toBe(400);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).put(`${BASE}/password`).send({ currentPassword: "x", newPassword: "NewPass1!" });
    expect(res.status).toBe(401);
  });
});
