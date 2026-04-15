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

  // Capture the prototype reference without pre-binding so that `this` is
  // resolved correctly at call time (Express's res.send relies on it).
  const originalJson = res.json;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (res as any).json = function (this: Response, body: unknown) {
    res.locals.__logBody = body;
    return originalJson.call(this, body);
  };

  res.on("finish", () => {
    const ms = Date.now() - start;
    const body = res.locals.__logBody;
    console.log(
      `[${ts()}] ← ${res.statusCode} ${req.method} ${req.originalUrl} ${ms}ms` +
        (body !== undefined ? ` ${JSON.stringify(body)}` : ""),
    );
  });

  next();
}
