const app = require("../app");
const request = require("supertest");

describe("User API", () => {
  test("Get all users", async () => {
    const res = await request(app).get("/api/v1/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  test("Get user profile (Authenticated User)", async () => {
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/v1/users/profile")
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
  });
});
