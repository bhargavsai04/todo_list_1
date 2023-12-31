const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
let server;
let agent;

describe("Database Test Cases", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await Promise.all([db.sequelize.close(), server.close()]);
    } catch (error) {
      console.error(error);
    }
  });

  test("POST /todos creates a todo and responds with json", async () => {
    const response = await agent
      .post("/todos")
      .send({ title: "Buy milk", dueDate: new Date().toISOString(), completed: false });

    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("POST /todos marks todo as completed", async () => {
    const res = await agent
      .post("/todos")
      .send({ title: "Do Homework", dueDate: new Date().toISOString(), completed: false });

    const parseResponse = JSON.parse(res.text);
    const todoID = parseResponse.id;

    expect(parseResponse.completed).toBe(false);

    const changeTodo = await agent.put(`/todos/${todoID}/markAsCompleted`).send();
    const parseUpdateTodo = JSON.parse(changeTodo.text);

    expect(parseUpdateTodo.completed).toBe(true);
  });

  test("GET /todos fetches all todos in the database", async () => {
    await agent.post("/todos").send({ title: "Buy xbox", dueDate: new Date().toISOString(), completed: false });
    await agent.post("/todos").send({ title: "Buy ps3", dueDate: new Date().toISOString(), completed: false });

    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(4);
    expect(parsedResponse[3].title).toBe("Buy ps3");
  });

  test("DELETE /todos/:id deletes a todo and sends a boolean response", async () => {
    const response = await agent
      .post("/todos")
      .send({ title: "Buy xbox", dueDate: new Date().toISOString(), completed: false });

    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    const res = await agent.delete(`/todos/${todoID}`).send();
    const bool = Boolean(res.text);

    expect(bool).toBe(true);
  });
});
