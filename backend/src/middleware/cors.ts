import cors from "cors";

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN
    ? new URL(process.env.FRONTEND_ORIGIN).origin
    : undefined,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean) as string[];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
});
