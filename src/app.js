import express from "express";
import helmet from "helmet";

export const incidents = [];
export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "16kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "UP" });
});

app.get("/incidents", (_request, response) => {
  response.json({ items: incidents, count: incidents.length });
});

app.post("/incidents", (request, response) => {
  const { title, severity } = request.body;
  const allowedSeverities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  if (
    typeof title !== "string" ||
    title.trim().length < 5 ||
    !allowedSeverities.includes(severity)
  ) {
    return response.status(400).json({ error: "INVALID_INCIDENT" });
  }

  const incident = {
    id: crypto.randomUUID(),
    title: title.trim(),
    severity,
    status: "OPEN"
  };

  incidents.push(incident);
  return response.status(201).json(incident);
});

app.patch("/incidents/:id", (request, response) => {
  const allowedStatuses = ["OPEN", "INVESTIGATING", "CLOSED"];
  const incident = incidents.find(({ id }) => id === request.params.id);

  if (!incident) {
    return response.status(404).json({ error: "INCIDENT_NOT_FOUND" });
  }

  if (!allowedStatuses.includes(request.body.status)) {
    return response.status(400).json({ error: "INVALID_STATUS" });
  }

  if (incident.status === "CLOSED" && request.body.status === "OPEN") {
    return response.status(409).json({ error: "INVALID_STATUS_TRANSITION" });
  }

  incident.status = request.body.status;
  return response.json(incident);
});
