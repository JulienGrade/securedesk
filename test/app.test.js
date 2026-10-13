import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app, incidents } from "../src/app.js";

beforeEach(() => {
  incidents.splice(0);
});

describe("SecureDesk API", () => {
  it("expose son état", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("UP");
  });

  it("crée un incident", async () => {
    const response = await request(app)
      .post("/incidents")
      .send({ title: "Messagerie indisponible", severity: "CRITICAL" });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeTypeOf("string");
    expect(response.body.status).toBe("OPEN");
  });

  it("liste les incidents créés", async () => {
    await request(app)
      .post("/incidents")
      .send({ title: "Messagerie indisponible", severity: "HIGH" });

    const response = await request(app).get("/incidents");

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.items[0].title).toBe("Messagerie indisponible");
  });

  it("refuse une sévérité inconnue", async () => {
    const response = await request(app)
      .post("/incidents")
      .send({ title: "Incident à vérifier", severity: "URGENT" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_INCIDENT");
  });
});
