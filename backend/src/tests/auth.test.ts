import request from "supertest";
import app from "@/app";
import { setupDB, teardownDB, clearDB } from "./setup";

beforeAll(async () => { await setupDB(); });
afterAll(async () => { await teardownDB(); });
afterEach(async () => { await clearDB(); });

const BASE = "/api/auth";
const credentials = { name: "Test User", email: "test@example.com", password: "password123" };

describe("POST /api/auth/register", () => {
  it("registers a new user and sets cookie", async () => {
    const res = await request(app).post(`${BASE}/register`).send(credentials);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 409 for duplicate email", async () => {
    await request(app).post(`${BASE}/register`).send(credentials);
    const res = await request(app).post(`${BASE}/register`).send(credentials);
    expect(res.status).toBe(409);
  });

  it("returns 400 when email or password missing", async () => {
    const res = await request(app).post(`${BASE}/register`).send({ email: "x@x.com" });
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
    expect(res.body.password).toBeUndefined();
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get(`${BASE}/profile`);
    expect(res.status).toBe(401);
  });
});
