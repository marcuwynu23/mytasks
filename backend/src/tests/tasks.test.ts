import request from "supertest";
import app from "@/app";
import { setupDB, teardownDB, clearDB } from "./setup";

beforeAll(async () => { await setupDB(); });
afterAll(async () => { await teardownDB(); });
afterEach(async () => { await clearDB(); });

const AUTH = "/api/auth";
const TASKS = "/api/tasks";

async function authAgent() {
  const agent = request.agent(app);
  await agent.post(`${AUTH}/register`).send({ name: "User", email: "u@test.com", password: "pass1234" });
  return agent;
}

describe("GET /api/tasks", () => {
  it("returns empty array for new user", async () => {
    const agent = await authAgent();
    const res = await agent.get(TASKS);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get(TASKS);
    expect(res.status).toBe(401);
  });
});

describe("POST /api/tasks", () => {
  it("creates a task", async () => {
    const agent = await authAgent();
    const res = await agent.post(TASKS).send({ title: "My task", description: "desc" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("My task");
    expect(res.body.status).toBe("pending");
  });

  it("returns 400 when title missing", async () => {
    const agent = await authAgent();
    const res = await agent.post(TASKS).send({ description: "no title" });
    expect(res.status).toBe(400);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).post(TASKS).send({ title: "task" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/tasks/:id", () => {
  it("returns a specific task", async () => {
    const agent = await authAgent();
    const created = await agent.post(TASKS).send({ title: "task1" });
    const res = await agent.get(`${TASKS}/${created.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(created.body._id);
  });

  it("returns 404 for non-existent task", async () => {
    const agent = await authAgent();
    const res = await agent.get(`${TASKS}/000000000000000000000001`);
    expect(res.status).toBe(404);
  });

  it("cannot access another user's task", async () => {
    const agent1 = await authAgent();
    const created = await agent1.post(TASKS).send({ title: "private" });

    const agent2 = request.agent(app);
    await agent2.post(`${AUTH}/register`).send({ name: "Other", email: "other@test.com", password: "pass1234" });
    const res = await agent2.get(`${TASKS}/${created.body._id}`);
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/tasks/:id", () => {
  it("updates a task", async () => {
    const agent = await authAgent();
    const created = await agent.post(TASKS).send({ title: "old title" });
    const res = await agent.put(`${TASKS}/${created.body._id}`).send({ title: "new title", status: "completed" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("new title");
    expect(res.body.status).toBe("completed");
  });

  it("returns 404 for non-existent task", async () => {
    const agent = await authAgent();
    const res = await agent.put(`${TASKS}/000000000000000000000001`).send({ title: "x" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes a task", async () => {
    const agent = await authAgent();
    const created = await agent.post(TASKS).send({ title: "to delete" });
    const res = await agent.delete(`${TASKS}/${created.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });

  it("returns 404 when task not found", async () => {
    const agent = await authAgent();
    const res = await agent.delete(`${TASKS}/000000000000000000000001`);
    expect(res.status).toBe(404);
  });

  it("cannot delete another user's task", async () => {
    const agent1 = await authAgent();
    const created = await agent1.post(TASKS).send({ title: "private" });

    const agent2 = request.agent(app);
    await agent2.post(`${AUTH}/register`).send({ name: "Other", email: "other2@test.com", password: "pass1234" });
    const res = await agent2.delete(`${TASKS}/${created.body._id}`);
    expect(res.status).toBe(404);
  });
});
