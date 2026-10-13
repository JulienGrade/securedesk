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

  it("fait passer un incident en cours d'investigation", async () => {
    const creation = await request(app)
      .post("/incidents")
      .send({ title: "Accès VPN indisponible", severity: "HIGH" });

    const response = await request(app)
      .patch(`/incidents/${creation.body.id}`)
      .send({ status: "INVESTIGATING" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("INVESTIGATING");
  });

  it("refuse un statut inconnu", async () => {
    const creation = await request(app)
      .post("/incidents")
      .send({ title: "Accès VPN indisponible", severity: "HIGH" });

    const response = await request(app)
      .patch(`/incidents/${creation.body.id}`)
      .send({ status: "ARCHIVED" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_STATUS");
  });

  it("retourne 404 pour un incident inconnu", async () => {
    const response = await request(app)
      .patch("/incidents/00000000-0000-0000-0000-000000000000")
      .send({ status: "CLOSED" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("INCIDENT_NOT_FOUND");
  });

  it("interdit de rouvrir directement un incident fermé", async () => {
    const creation = await request(app)
      .post("/incidents")
      .send({ title: "Accès VPN indisponible", severity: "HIGH" });

    await request(app)
      .patch(`/incidents/${creation.body.id}`)
      .send({ status: "CLOSED" });

    const response = await request(app)
      .patch(`/incidents/${creation.body.id}`)
      .send({ status: "OPEN" });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("INVALID_STATUS_TRANSITION");
  });
});
