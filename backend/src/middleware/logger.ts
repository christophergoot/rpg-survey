import { Request, Response, NextFunction } from "express";

function redact(body: unknown): unknown {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const obj = { ...(body as Record<string, unknown>) };
    if ("password" in obj) obj.password = "[REDACTED]";
    return obj;
  }
  return body;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const ts = () => new Date().toISOString();

  const reqBody =
    req.body && Object.keys(req.body).length > 0 ? redact(req.body) : undefined;
  console.log(
    `[${ts()}] → ${req.method} ${req.originalUrl}` +
      (reqBody ? ` ${JSON.stringify(reqBody)}` : ""),
  );

  let responseBody: unknown;
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `[${ts()}] ← ${res.statusCode} ${req.method} ${req.originalUrl} ${ms}ms` +
        (responseBody !== undefined ? ` ${JSON.stringify(responseBody)}` : ""),
    );
  });

  next();
}
