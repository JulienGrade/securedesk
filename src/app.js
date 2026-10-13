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
