import "dotenv/config";
import express from "express";
import { corsMiddleware } from "./middleware/cors";
import { requireAuth } from "./middleware/auth";
import authRouter from "./routes/auth";
import questionsRouter from "./routes/questions";
import surveysRouter from "./routes/surveys";
import responsesRouter from "./routes/responses";
import publicRouter from "./routes/public";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(corsMiddleware);
app.use(express.json());

// Health check — Render uses this to verify the service is up
app.get("/health", (_req, res) => res.json({ ok: true }));

// Public routes (no auth required)
app.use("/auth", authRouter);
app.use("/questions", questionsRouter);
app.use("/public", publicRouter);

// Protected routes (JWT required)
// /surveys handles CRUD + GET /:id/responses
// /responses handles PATCH /:id/player-name + DELETE /:id
app.use("/surveys", requireAuth, surveysRouter);
app.use("/responses", requireAuth, responsesRouter);

app.listen(PORT, () => {
  console.log(`rpg-survey-api listening on port ${PORT}`);
});
