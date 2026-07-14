import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

// Sliding session: /api/users/me re-issues the cookie on every app load,
// so a session only dies after 30 days WITHOUT opening the app
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // seconds

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: SESSION_MAX_AGE });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
