import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "30d";

export interface TokenPayload {
  sub: string;
  email: string;
  display_name: string;
}

export function signToken(user: {
  id: string;
  email: string;
  display_name: string;
}): string {
  return jwt.sign(
    { sub: user.id, email: user.email, display_name: user.display_name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
